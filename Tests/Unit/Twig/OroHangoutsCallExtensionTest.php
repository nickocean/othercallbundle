<?php

namespace Oro\Bundle\OtherCallBundle\Tests\Unit\Twig;

use Oro\Bundle\OtherCallBundle\Twig\OroOtherCallExtension;
use Oro\Component\Testing\Unit\TwigExtensionTestCaseTrait;

class OroHangoutsCallExtensionTest extends \PHPUnit_Framework_TestCase
{
    use TwigExtensionTestCaseTrait;

    /** @var OroOtherCallExtension */
    protected $extension;

    /** @var array */
    protected $initialAppsParameter = [['app_id' => '100000000001']];

    protected function setUp()
    {
        $container = self::getContainerBuilder()
            ->addParameter('oro_hangouts.initial_apps', $this->initialAppsParameter)
            ->getContainer($this);

        $this->extension = new OroOtherCallExtension($container);
    }

    public function testGetInitialApps()
    {
        $this->assertEquals(
            $this->initialAppsParameter,
            self::callTwigFunction($this->extension, 'get_hangoutscall_initail_apps', [])
        );
    }

    public function testGetName()
    {
        $this->assertEquals('oro_hangoutscall_extension', $this->extension->getName());
    }
}
