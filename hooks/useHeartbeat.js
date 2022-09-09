import React, { useEffect, useRef, useState } from 'react';

function useHeartbeat(heartbeat, timeout = 1000/10) {
    const DoesHeartbeat = useRef(true);

    function guardedHeartbeat() {
        heartbeat();
        if(DoesHeartbeat.current)
            setTimeout(guardedHeartbeat, timeout);
    }

    useEffect(()=>{
        guardedHeartbeat();

        return () => DoesHeartbeat.current = false;
    }, [])

    return DoesHeartbeat;
}

export default useHeartbeat;