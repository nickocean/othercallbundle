<?php

namespace Oro\Bundle\OtherCallBundle\Migrations\Schema\v1_1;

use Doctrine\DBAL\Schema\Schema;
use Oro\Bundle\CalendarBundle\Entity\CalendarEvent;
use Oro\Bundle\EntityConfigBundle\Migration\UpdateEntityConfigFieldValueQuery;
use Oro\Bundle\OtherCallBundle\Form\UseOtherCheckboxType;
use Oro\Bundle\MigrationBundle\Migration\Migration;
use Oro\Bundle\MigrationBundle\Migration\QueryBag;

class ReplaceFormAliases implements Migration
{
    /**
     * {@inheritdoc}
     */
    public function up(Schema $schema, QueryBag $queries)
    {
        $queries->addQuery(
            new UpdateEntityConfigFieldValueQuery(
                CalendarEvent::class,
                'use_other',
                'form',
                'form_type',
                UseOtherCheckboxType::class,
                'oro_other_call_use_other_checkbox_type'
            )
        );
    }
}
