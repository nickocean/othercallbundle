define(function(require) {
    'use strict';

    var InviteOtherComponent;
    var _ = require('underscore');
    var mediator = require('oroui/js/mediator');
    var __ = require('orotranslation/js/translator');
    var InviteButtonView = require('../views/invite-button-view');
    var InviteModalView = require('../views/invite-modal-view');
    var OtherEventBroker = require('oroothercall/js/other-event-broker');
    var WidgetComponent = require('oroui/js/app/components/widget-component');
    var BaseComponent = require('oroui/js/app/components/base/component');

    InviteOtherComponent = BaseComponent.extend({
        /** @type {Object} */
        modalOptions: null,

        /** @type {Object} */
        onAppStartOptions: null,

        /** @type {OtherEventBroker} */
        eventBroker: null,

        /**
         * @inheritDoc
         */
        constructor: function InviteOtherComponent() {
            InviteOtherComponent.__super__.constructor.apply(this, arguments);
        },

        /**
         * Initializes InviteHangout component
         *
         * @param {Object} options
         * @param {Object} options.modalOptions options for invite hangout modal dialog
         * @param {Object} options.onAppStartOptions options for modal dialog
         */
        initialize: function(options) {
            _.extend(this, _.defaults(_.pick(options, ['modalOptions', 'onAppStartOptions']), {
                modalOptions: {}
            }));

            this.inviteButtonView = new InviteButtonView({
                el: options._sourceElement[0]
            });
            this.listenTo(this.inviteButtonView, 'invite', this.openInviteModal);
        },

        /**
         * Opens InviteModal dialog
         *  -
         */
        openInviteModal: function() {
            this.ensureEventBroker();

            var modalOptions = _.extend({
                token: this.eventBroker.getToken()
            }, this.modalOptions);
            this.inviteModal = new InviteModalView(modalOptions);

            this.listenTo(this.inviteModal, {
                'hidden': this.onInviteModalHide,
                'fail': this.onStartButtonFail,
                'application-start': this.onOtherAppStart
            });

            this.inviteModal.open();
        },

        /**
         * Create a new eventBroker (disposes existed, if there's one)
         * and subscribes handler on 'application-start' event
         */
        ensureEventBroker: function() {
            if (this.eventBroker) {
                this.unsetEventBroker();
            }
            this.eventBroker = new OtherEventBroker();
            this.listenTo(this.eventBroker, 'application-start', this.onOtherAppStart);
        },

        /**
         * Disposes and unset instance or HangoutEventBroker
         */
        unsetEventBroker: function() {
            this.stopListening(this.eventBroker);
            this.eventBroker.dispose();
            delete this.eventBroker;
        },

        /**
         * Unset instance or InviteHangoutModal dialog
         */
        unsetInviteModal: function() {
            this.stopListening(this.inviteModal);
            delete this.inviteModal;
        },

        /**
         * Handles InviteHangoutModal dialog hide action
         */
        onInviteModalHide: function() {
            this.unsetInviteModal();
        },

        /**
         * Handles StartOtherButton initialization fail
         */
        onStartButtonFail: function() {
            if (this.inviteModal) {
                this.inviteModal.close();
            }
            mediator.execute('showErrorMessage', __('oro.othercall.messages.connection_error'));
        },

        /**
         * Handles application start
         *  - closes InviteOtherModal dialog
         *  - opens onAppStart widget if there's defined one
         *  - unbind eventBroker instance and passes it to other component or dispose
         */
        onOtherAppStart: function() {
            // close inviteModal dialog
            if (this.inviteModal) {
                this.inviteModal.close();
            }

            // unbind eventBroker to pass into some other component (if there's one)
            var eventBroker = this.eventBroker;
            this.stopListening(this.eventBroker);
            delete this.eventBroker;

            var opts = this.onAppStartOptions;
            if (opts && opts.widgetComponentOptions && opts.targetComponentName) {
                this.passEventBrokerToComponentOfWidget(
                    opts.widgetComponentOptions,
                    opts.targetComponentName,
                    eventBroker
                );
            } else {
                eventBroker.dispose();
            }
        },

        /**
         * Creates and opens a widget via WidgetComponent,
         * passes eventBroker instance into target component of an opened widget
         *
         * @param {Object} widgetComponentOptions - options for a widget component
         * @param {string} targetComponentName - name of component inside the widget that accepts eventBroker
         * @param {OtherEventBroker} eventBroker
         */
        passEventBrokerToComponentOfWidget: function(widgetComponentOptions, targetComponentName, eventBroker) {
            var widgetComponent = new WidgetComponent(widgetComponentOptions);
            widgetComponent.openWidget().done(function(widget) {
                if (widget && widget.pageComponent(targetComponentName)) {
                    var targetComponent = widget.pageComponent(targetComponentName);
                    if (_.isFunction(targetComponent.setExternalEventBroker)) {
                        targetComponent.setExternalEventBroker(eventBroker);
                        return;
                    }
                }
                eventBroker.dispose();
            }).fail(function() {
                eventBroker.dispose();
            }).always(function() {
                widgetComponent.dispose();
            });
        }
    });

    return InviteOtherComponent;
});
