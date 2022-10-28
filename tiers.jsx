import React, {useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import Heading from './../../../components/layouts/heading';
import { usePrompt } from '../clientScoring/dirtyFormCheck';

import { updateTiers, saveRequired } from "./../../../redux/actions/actionCreators";

const Tiers = (props) => {
     
    const { tiersList,constants, actionRequired } = useSelector((state) => state?.dataPack)

    const dispatch              = useDispatch()
    const [ tiers, setTiers ]   = useState(0)
    const tierUrl               = props?.url
    usePrompt(constants?.POPUP_MODAL_MESSAGE,actionRequired)

    return (
        <>
            <div className="tier-table-wrapper table-wrapper">
                <div className="checkbox-table-wrapper px-4 py-3">
                    <div className="add-new-wrapper d-flex flex-row-reverse">
                        <button type="button" className={`btn ${actionRequired && 'notify'}`} onClick={() => handleSubmitEvent(tiers)}><i className="fa-solid fa-floppy-disks"></i> Save</button>
                    </div>
                </div>
                <hr/>
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th scope="col">Designator</th>
                                <th scope="col">Description</th>
                                <th scope="col">Minimum</th>
                                <th scope="col">Maximum</th>
                                <th scope="col">Range</th>
                                <th scope="col">On/Off</th>
                            </tr>
                        </thead>
                        <tbody>
                           {
                               renderTierOptions()
                           }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

    function renderTierOptions()
    {
        let tierData  = tiers?.length ? tiers : tiersList

        if( tierData?.length ){

            return tierData?.map( (option, index) => {

                return (
                    <tr key={ option?.tier_type?.toString() }>
                        <td>{ option?.designator }</td>
                        <td><button className={`btn border-0 ${(option?.tier_type).toLowerCase()}-btn`} type="button">{ option?.tier_type }</button>
                        </td>
                        <td>
                            
                            <label htmlFor="minimum" className="form-label visually-hidden">Minimum</label>
                            <input type="number" className="form-control" data-type="min_value" value={option?.min_value} required onChange={el => updateDataValue(el, index)} />
                            
                        </td>
                        <td>
                            
                            <label htmlFor="maximum" className="form-label visually-hidden">Maximum</label>
                            <input type="number" className="form-control" data-type="max_value" defaultValue={option?.max_value} required onChange={el => updateDataValue(el, index)}/>
                            
                        </td>
                        <td>
                            <div className="d-flex align-items-center justify-content-center">
                                
                                <label htmlFor="minimum"
                                    className="form-label visually-hidden">Minimum</label>
                                <input type="number" className="form-control" id="minimum" value={option?.min_value} readOnly />
                                
                                <span>-</span>
                                
                                <label htmlFor="maximum"
                                    className="form-label visually-hidden">Maximum</label>
                                <input type="number" className="form-control" id="maximum" defaultValue={option?.max_value} readOnly/>
                                
                            </div>
                        </td>
                        <td>
                            <div className="form-check form-switch p-0">
                                <input className="form-check-input m-auto float-none" type="checkbox" value={option?.status ? false : true}
                                    id="flexSwitchCheckChecked" data-type="status" checked={option?.status} onChange={el => updateStatus(el, index)} />
                            </div>
                        </td>
                    </tr>
                )
            })
        }
    }

    function updateDataValue(el, index)
    {
        let cloneTiers  = tiers?.length ? {...tiers} : tiersList
        
        cloneTiers[index][el.target.getAttribute('data-type')] = el.target.value ? parseInt(el.target.value) : ''
        
        /** updating tiers value */
        setTiers(cloneTiers?.values())
        /** save action notification */
        dispatch(saveRequired(true))
    }

    function updateStatus(el, index)
    {
        let cloneTiers  = tiers?.length ? {...tiers} : tiersList
        
        cloneTiers[index][el.target.getAttribute('data-type')] = el.target.checked ? 1 : 0
        
        /** updating tiers value */
        setTiers(cloneTiers?.values())
        /** save action notification */
        dispatch(saveRequired(true))
    }

    function handleSubmitEvent(tiers)
    {
        let formData  = []

        let cloneTiers  = tiers?.length ? {...tiers} : tiersList
        
        cloneTiers?.map(option => {

            formData.push({
                'designator' :option?.designator,
                'tier_type' : option?.tier_type,
                'min_value' : option?.min_value,
                'max_value' : option?.max_value,
                'status' : option?.status
            })
        })
        dispatch(updateTiers(tierUrl, formData))
        dispatch(saveRequired(''))
    }
};

export default Tiers;