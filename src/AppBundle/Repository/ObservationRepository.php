<?php

namespace AppBundle\Repository;

/**
 * ObservationRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class ObservationRepository extends \Doctrine\ORM\EntityRepository
{
	/**
	 * Find last validated observations with paging system when needed
	 *
	 * @param int $page The page number
	 * @param int $nbPerPage The number of results returned on page
	 *
	 * Return array of Observation objects
	 */
	public function findObservations(int $page, int $nbPerPage, bool $validation = null)
	{
		$qb = $this->createQueryBuilder('observation')
			->addSelect('taxref')
			->join('observation.taxref', 'taxref')
		;

		if ($validation !== null)
		{
			$qb = $qb->where('observation.valide = :valide')
   				->setParameter('valide', $validation)
   			;
		}

   		$qb = $qb->orderBy('observation.id', 'DESC')
 		    ->getQuery()
			// Set default paging observation start
			->setFirstResult(($page - 1) * $nbPerPage)
			// Set number of observations per page
			->setMaxResults($nbPerPage)
		;

		// Paginator replaces QueryBuilder method getResults(), with pagination setup
		return new \Doctrine\ORM\Tools\Pagination\Paginator($qb, true);
	}

	/**
	 * Find validated observations by taxref
	 *
	 * @param int $taxref The taxref id
	 * @param int $page The current page number
	 *
	 * Return array of Observation objects
	 */
	public function findValidatedObservationsByTaxref(int $taxref, int $page)
	{
		$qb = $this->createQueryBuilder('observation')
			->addSelect('taxref')
			->join('observation.taxref', 'taxref')
			->where('observation.valide = :valide')
   			->setParameter('valide', 1)
   			->andWhere('observation.taxref = :taxref')
   			->setParameter('taxref', $taxref)
			->orderBy('observation.id', 'DESC')
 		    ->getQuery()
			// Set default paging observation start
			->setFirstResult(($page - 1) * 8)
			// Set number of observations per page
			->setMaxResults(8)
		;	

		// Paginator replaces QueryBuilder method getResults(), with pagination setup
		return new \Doctrine\ORM\Tools\Pagination\Paginator($qb, true);
	}
}
