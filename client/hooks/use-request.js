import { useState } from "react";


/**
 * 
 * @param {string} method GET | POST | PUT | DELETE
 * @param {string} url 
 * @param {Object} body 
 * @param {CallBack} onSuccess (data) => todo
 * @returns 
 */
export const useRequest = ({ method, url, body, onSuccess, whileWaiting }) => {
    const [errors, setErrors] = useState([]);
    const [showWhileWaiting, setShowWhileWaiting] = useState(false);
    return [(event) => {
        event?.preventDefault();
        setShowWhileWaiting(true);
        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then(res =>
            res.json()
                .then(data => {
                    setShowWhileWaiting(false);
                    if (res.ok) {
                        setErrors([]);
                        onSuccess(data);
                    } else
                        setErrors(data);
                }));
    },
    ((errors.length > 0
        && <div className="alert alert-danger">
            <h4>Ooops....</h4>
            <ul className="my-0">
                {errors.map((e, i) => <li key={i}><b>{e.field}</b>: {e.message}</li>)}
            </ul>
        </div>
    ) || (showWhileWaiting && <whileWaiting />))];
}

export default useRequest;