exports.responseHandler = (res, body) => {
    const payload = {
        payload:body,
        status:1
    }
    res.json(payload);
}


exports.applyRoutes = (router, routes) => {
    routes.forEach((route)=>{
        switch(route.method){
            case 'GET':
                router.get(route.path,...route.handlers);
                break;
            case 'POST':
                router.post(route.path,...route.handlers);
            case 'DELETE':
                router.delete(route.path,...route.handlers);
            case 'PATCH':
                router.patch(route.path,...route.handlers);    
        }
    })

    return router;
}

