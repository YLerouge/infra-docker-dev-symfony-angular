<?php

use App\Entity\Pokemon;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

final class PokemonTest extends KernelTestCase
{
    private EntityManagerInterface $em;

    public function setUp(): void
    {
        self::bootKernel();
        $container = static::getContainer();
        $this->em = $container->get(EntityManagerInterface::class);
    }

    public function testPokemonEntity(): void
    {
        $pokemon = new Pokemon();

        $pokemon->setName(name: 'toto');
        $this->assertSame('toto', $pokemon->getName());

        $pokemon->setType('psy');
        $this->assertSame('psy', $pokemon->getType());

        $pokemon->setWeight(10);
        $this->assertSame(10, $pokemon->getWeight());

        $this->em->persist($pokemon);
        $this->em->flush();

        $pokemonFromDatabase = $this->em->getRepository(Pokemon::class)->findOneBy(['name' => 'toto']);
        $this->assertSame($pokemon, $pokemonFromDatabase);
        $this->assertSame(1, $pokemonFromDatabase->getId());
    }
}
