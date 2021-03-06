define(function(require) {
    'use strict';

    var InviteModalView;
    var _ = require('underscore');
    var __ = require('orotranslation/js/translator');
    var Modal = require('oroui/js/modal');
    var StartButtonView = require('./start-button-view');
    var modalContentTemplate = require('tpl!../../../templates/invite-modal-content.html');

    InviteModalView = Modal.extend({
        className: 'modal oro-modal-normal invite-other-modal',

        /** @type {StartButtonView} */
        startButtonView: null,

        /** @type {string|null} */
        token: null,

        /** @type {Object} */
        otherOptions: null,

        /**
         * @inheritDoc
         */
        constructor: function InviteModalView() {
            InviteModalView.__super__.constructor.apply(this, arguments);
        },

        /**
         * @inheritDoc
         */
        initialize: function(options) {
            _.extend(this, _.defaults(_.pick(options, ['otherOptions', 'token']), {
                otherOptions: {}
            }));
            InviteModalView.__super__.initialize.call(this, options);
        },

        getContentTemplateData: function() {
            return {
                invites: this.otherOptions.invites || []
            };
        },

        render: function() {
            this.options.title = __('oro.othercall.start_other_dialog.title');
            this.options.content = modalContentTemplate(this.getContentTemplateData());

            InviteModalView.__super__.render.call(this);

            this.startButtonView = new StartButtonView({
                autoRender: true,
                otherOptions: this.otherOptions,
                token: this.token
            });
            this.listenTo(this.startButtonView, 'click', function() {
                this.trigger('application-start');
            });

            if (this.startButtonView.deferredRender) {
                this.startButtonView.deferredRender.fail(_.bind(function() {
                    this.trigger('fail');
                }, this));
            }

            this.$('.modal-footer').append(this.startButtonView.$el);

            return this;
        },

        remove: function() {
            if (this.startButtonView) {
                this.startButtonView.dispose();
                delete this.startButtonView;
            }
            InviteModalView.__super__.remove.call(this);
        }
    });

    return InviteModalView;
});
