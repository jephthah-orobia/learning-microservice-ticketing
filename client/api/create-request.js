
const createRequest = (req, method = 'GET', path = '/', body = {}) => {
    const params = {
        method: method,
        headers: req?.headers,
        body: JSON.stringify(body)
    }

    if (/get/i.test(method))
        delete params.body;

    if (typeof window === 'undefined')
        return new Request('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local' + path, params);
    else {
        // request is on client
        delete params.headers
        return new Request(path, params);
    }
}

export default createRequest;