import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import Heading from './../../../components/layouts/heading'

import { saveClientScoreData, warningMsg } from "./../../../redux/actions/actionCreators";
import DemographicScore from "./demographicScore";
import PsychographicScore from "./psychographicScore";
import Users from './users'

/** popup button and popover */
import 'reactjs-popup/dist/index.css';

const Scoring = () => {
    
    const params  = useParams()
    const dispatch = useDispatch()

    const { constants, actionRequired, clientPsychoPoints, selectedListing } = useSelector((state) => state?.dataPack)

    const { DEMOGRAPHIC, PSYCHOGRAPHIC } = constants?.METRIC_TYPE
    
    return (
        <>
            <Heading title={"Client Scoring"} date="13/02/2022"/>
            <div className="client-scoring-table-wrapper table-wrapper">
                <div className="checkbox-table-wrapper">
                    <div className="checkbox-table-head d-flex flex-wrap align-items-center justify-content-end justify-content-sm-between px-4 py-3 bb-color">
                        <h2></h2>
                        <div className="add-new-wrapper d-flex flex-wrap align-items-center justify-content-between">
                            <Users />
                            <button type="button" className={`btn text-white ${actionRequired && 'notify'}`} onClick={() => handleSaveEvent()}><i className="fa-solid fa-floppy-disks"></i> Save</button>
                        </div>
                    </div>
                </div>
                {
                    (params?.type == (constants?.METRIC_AREA_TYPE[DEMOGRAPHIC])?.toLowerCase()) &&
                    <DemographicScore />
                }
                {
                    (params?.type == (constants?.METRIC_AREA_TYPE[PSYCHOGRAPHIC])?.toLowerCase()) &&
                    <PsychographicScore />
                }

                <ul className="nav nav-tabs justify-content-center align-items-center d-flex" id="clientscoringTab"
                    role="tablist">
                    <li className="nav-item" role="presentation">
                        <Link className={`nav-link ${params?.type == (constants?.METRIC_AREA_TYPE[DEMOGRAPHIC])?.toLowerCase() && 'active'}`}  to={`/client-scoring/demographic`}>1</Link>
                    </li>
                    <li className="nav-item" role="presentation">
                        <Link className={`nav-link ${params?.type == (constants?.METRIC_AREA_TYPE[PSYCHOGRAPHIC])?.toLowerCase() && 'active'}`}  to={`/client-scoring/psychographic`}>2</Link>
                    </li>
                </ul>
            </div>
        </>
    );
    
    /**
     * handle submit event and save user data
     * 
     * @param {*} NA
     * @return 
     */
    function handleSaveEvent()
    {
        try {

            let areaDataValues  = []

            if( clientPsychoPoints )
            {
                if( selectedListing?.value )
                {
                    areaDataValues  = getSerialize(clientPsychoPoints)
    
                    dispatch(saveClientScoreData(selectedListing?.value, areaDataValues))
                }
                else{
                    warningMsg("Statement listing is required field.", 'Warning')
                }
            } 
        } catch (error) {
        }
    }

    /**
     * get serialize metric data values
     * 
     * @param {object} clientPsychoPoints 
     * @returns {array} areaData
     */
    function getSerialize(clientPsychoPoints)
    {
        let areaData  = []

        clientPsychoPoints?.map((option, index)=> {

            Object.keys(option)?.map( key => {

                let data  = {
                    client_id: index,
                    metric_area_id: key,
                    score: option[key]
                }
                areaData.push(data)
            })        
        })
        return areaData
    }
};

export default Scoring;