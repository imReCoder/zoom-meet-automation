const responseHandler = (res, body) => {
    const payload = {
        payload:body,
        status:1
    }
    res.json(payload);
}


const applyRoutes = (router, routes) => {
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

const delay = (ms) => {
    return new Promise(_ => setTimeout(_, ms))
}

const dayToNumber = (day) => {
    switch (day) {
        case 'Sunday':
            return 0;
        case 'Monday':
            return 1;
        case 'Tuesday':
            return 2;
        case 'Wednesday':
            return 3;
        case 'Thursday':
            return 4;
        case 'Friday':
            return 5;
        case 'Saturday':
            return 6;

    }
}

module.exports = {
    responseHandler,
    applyRoutes,
    delay,
    dayToNumber
}