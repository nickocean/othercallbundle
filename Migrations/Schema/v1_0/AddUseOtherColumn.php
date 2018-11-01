<?php

namespace Oro\Bundle\OtherCallBundle\Migrations\Schema\v1_0;

use Doctrine\DBAL\Schema\Schema;
use Oro\Bundle\EntityBundle\EntityConfig\DatagridScope;
use Oro\Bundle\EntityExtendBundle\EntityConfig\ExtendScope;
use Oro\Bundle\OtherCallBundle\Form\UseOtherCheckboxType;
use Oro\Bundle\MigrationBundle\Migration\Migration;
use Oro\Bundle\MigrationBundle\Migration\QueryBag;

class AddUseOtherColumn implements Migration
{
    /**
     * {@inheritdoc}
     */
    public function up(Schema $schema, QueryBag $queries)
    {
        self::useOtherColumn($schema);
    }

    /**
     * @param Schema $schema
     */
    public static function useOtherColumn(Schema $schema)
    {
        $table = $schema->getTable('oro_calendar_event');
        $table->addColumn(
            'use_other',
            'boolean',
            [
                'oro_options' => [
                    'extend'       => ['owner' => ExtendScope::OWNER_CUSTOM],
                    'form'         => [
                        'is_enabled' => true,
                        'form_type' => UseOtherCheckboxType::class
                    ],
                    'datagrid'     => ['is_visible' => DatagridScope::IS_VISIBLE_FALSE],
                ],
                'notnull'     => false,
            ]
        );
    }
}
