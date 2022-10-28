import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const SubMenu = () => {

    const { constants } = useSelector((state) => state?.dataPack) 

    return (
        <>
            <ul className="nav nav-tabs justify-content-end d-flex px-3" id="wowTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <a className="btn dropdown-toggle nav-link rounded-0 border-0" href="#" id="activityDropdown" data-bs-toggle="dropdown" aria-expanded="false">Settings</a>
                    <ul className="dropdown-menu p-0 rounded-0" aria-labelledby="activityDropdown">
                        <li><Link to={`/manage/areas/list/${constants?.METRIC_TYPE?.DEMOGRAPHIC}`} className="nav-link active" >Demographics</Link></li>
                        <li><Link to={`/manage/areas/list/${constants?.METRIC_TYPE?.PSYCHOGRAPHIC}`} className="nav-link active" >Psychographics</Link></li>
                        <li><Link to={`/admin/tiers`} className="nav-link active" >Tiers</Link></li>
                    </ul>
                </li>
                <li className="nav-item" role="presentation">
                    <Link to="/demographics" className="nav-link active" >Demographics</Link>
                </li>
                <li className="nav-item" role="presentation">
                    <Link to="/demographic-metrics" className="nav-link" >Demographic Metrics</Link>
                </li>
                <li className="nav-item" role="presentation">
                    <Link to="/psychographics" className="nav-link" >Psychographics</Link>
                </li>
                <li className="nav-item" role="presentation">
                    <Link to="/psychographic-metrics" className="nav-link" >Psychographics Metrics</Link>
                </li>
                <li className="nav-item" role="presentation">
                    <Link to="/tiers" className="nav-link" >Tiers</Link>
                </li>
                <li className="nav-item" role="presentation">
                    <Link to="/client-scoring" className="nav-link" >Client Scoring</Link>
                </li>
            </ul>
        </>
    )
}

export default SubMenu