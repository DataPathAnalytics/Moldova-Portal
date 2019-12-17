<?php

namespace App\Moldova\Repositories\Tenders;


use App\Moldova\Entities\Tenders;

interface TendersRepositoryInterface
{

    /**
     * @return Tenders
     */
    public function getTendersByOpenYear();

    /**
     * @return Tenders
     */
    public function getTendersBySource();

    /**
     * @return array
     */
    public function getDistinctSource();

    /**
     * @param $procuringAgency
     * @return mixed
     */
    public function getProcuringAgencyTenderByOpenYear($procuringAgency);

    /**
     * @param $params
     * @return mixed
     */
    public function getAllTenders($params);

    /**
     * Get count of tenders
     * @param $params
     *
     * @return mixed
     */
    public function getTendersCount($params);

    /**
     * @param $tenderID
     * @return mixed
     */
    public function getTenderDetailByID($tenderID);

    /**
     * @param $ref
     * @return mixed
     */
    public function getTenderFeedback($ref);
}
