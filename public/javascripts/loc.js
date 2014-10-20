var f4exbloc = f4exbloc || {};

//==================================================================================================
f4exbloc.distance = function(lat1, lon1, lat2, lon2) {
    lat1 = lat1 * (Math.PI / 180.0);
    lon1 = lon1 * (Math.PI / 180.0);
    lat2 = lat2 * (Math.PI / 180.0);
    lon2 = lon2 * (Math.PI / 180.0);

    return Math.acos(Math.sin(lat1)*Math.sin(lat2)+Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1))*6371.0;    
};

//==================================================================================================
f4exbloc.bearing = function(lat1, lon1, lat2, lon2) {
    lat1 = lat1 * (Math.PI / 180.0);
    lon1 = lon1 * (Math.PI / 180.0);
    lat2 = lat2 * (Math.PI / 180.0);
    lon2 = lon2 * (Math.PI / 180.0);  
    //double dLat = lat2 - lat1;
    dLon = lon2 - lon1;
    y = Math.sin(dLon) * Math.cos(lat2);
    x = (Math.cos(lat1) * Math.sin(lat2)) - 
        (Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon));
    bear_rad = Math.atan2(y,x);

    if (bear_rad > 0)
        return bear_rad * (180.0 / Math.PI); 
    else
        return 360.0 + (bear_rad * (180.0 / Math.PI)); 
};
