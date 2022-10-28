import { useEffect } from 'react'
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { deleteClient, saveActiveMetric, getClientScoreData, saveClientPsychoPoints, saveClientTotalPoints, saveRequired, getClientMetricData } from "./../../../redux/actions/actionCreators";
import { usePrompt } from './dirtyFormCheck';


const PsychographicScore = () => {

    const dispatch = useDispatch()
    const params = useParams()

    const { selectedListing, clients, constants,actionRequired, clientMetricData, clientPsychoPoints, clientTotalPoints, helper, tiersList } = useSelector((state) => state?.dataPack)
    usePrompt(constants?.POPUP_MODAL_MESSAGE,actionRequired)

    useEffect( async() => {
        helper?.setTitle();
        /** get client saved metric data */
        await dispatch(getClientMetricData(selectedListing?.value, constants?.METRIC_TYPE?.PSYCHOGRAPHIC))

        await dispatch(getClientScoreData(selectedListing?.value, constants?.METRIC_TYPE?.PSYCHOGRAPHIC))

    }, dispatch)

    return (
        <>
            {
                clientMetricData?.length 
                ?
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th scope="col">Client Name</th>
                                <th scope="col" colSpan="5">Psychographic Metrics Values</th>
                                <th scope="col">Score</th>
                                <th scope="col">Tier</th>
                            </tr>
                            <tr>
                                <th></th>
                                {
                                    renderMetric()
                                }
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                renderClient()
                            }
                        </tbody>
                    </table>
                </div>
                :
                <div className="d-flex flex-wrap align-items-center justify-content-between px-4 py-3 bb-color"><h4>No Metric data found!</h4></div>
            }
        </>
    )

    /**
     * Client metric list
     *  
     * @returns object
     */
    function renderMetric() {
        return clientMetricData?.map((option, index) => {

            return (
                <>
                    <th scope="col">{option?.metric_title}</th>
                </>
            )
        })
    }
    /**
     *  rendering client score and update component
     * @returns 
     */
    function renderClient() {

        return clients?.map(client => {

            let tiersData   = helper?.clientTierValue(tiersList, clientTotalPoints, client?.id)
            
            return (
                <tr>
                    <td><span className='float-start ps-1'>{client?.name}</span> <button className="border-0 bg-none dlt-client float-end" type="button" onClick={(el) => handleUserdeleteEvent(el, client)}><i className="fa fa-trash"></i></button></td>
                    {
                        renderMetricData(client)
                    }
                    <td>{ tiersData?.clientScore }</td>
                    <td>
                        {
                            tiersData?.tierClass ?
                            <button className={`btn border-0 ${tiersData?.tierClass}`} type="button">{ tiersData?.title}</button>
                            :
                            <button className={`btn border-0 bronze-btn disabled`} type="button">-</button>
                        }
                    </td>
                </tr>
            )
        })
    }

    /**
     * Client metric list
     *  
     * @returns object
     */
    function renderMetricData(client) {

        return clientMetricData?.map((option, index) => {

            let saltString  = option?.metric_id +'-'+ client?.id

            let values  = (Array.isArray(clientTotalPoints) && Array.isArray(clientTotalPoints[client?.id]) && clientTotalPoints[client?.id][option?.metric_id]) ? clientTotalPoints[client?.id][option?.metric_id] : ''

            return (
                <>
                    <td key={index?.toString()} onClick={() => dispatch(saveActiveMetric(saltString))}>
                        {
                            <select className="form-select custom-select-style" onChange={(el) => handleInputChangeEvent(el, option, client)}  value={values}>
                                <option value="0">0</option>
                                {
                                    renderMetricValue(option)
                                }
                            </select>
                        }
                    </td>
                </>
            )
        })
    }

    /**
     * Client metric list
     *  
     * @returns object
     */
     function renderMetricValue(option) {

        const {METRIC_DATA_VALUE} = constants

        return METRIC_DATA_VALUE.map((element,index) => {

            return (
                <option key={element?.toString()} value={element}>{element}{option?.metric_data[index]?.metric_value  ? ` ( ${option?.metric_data[index]?.metric_value } )`:null}</option>
            )
            
        });
    }

    /**
     * handle input change event
     * 
     * @param {event} el 
     * @param {object} option 
     * @param {object} client 
     * 
     * @return 
     */
    function handleInputChangeEvent(el, option, client)
    {
        let value  = el.target.value

        let dataValues  = clientPsychoPoints

        if( !dataValues[client?.id] )
            dataValues[client?.id] = []

        dataValues[client?.id][option?.metric_id] = value

        /** save action notification */
        dispatch(saveRequired(true))

        /** disabled editing */
        dispatch(saveActiveMetric(''))

        /** storing all data changed value */
        dispatch(saveClientPsychoPoints(dataValues))

        /** setting client total scores */
        dispatch(saveClientTotalPoints(helper?.getClientScore(value, client?.id, option?.metric_id, dataValues)))
        
    }

    /**
     * handle user delete event
     * 
     * @param {event} el 
     * @param {*} client 
     */
    function handleUserdeleteEvent(el, client)
    {
        el.preventDefault()

        /** trigger client delete event */
        dispatch(deleteClient(client?.id, selectedListing?.value))
    }
}

export default PsychographicScore