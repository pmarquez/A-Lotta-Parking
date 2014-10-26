/*
 * Tutorial created by: Paulo E. Márquez Herrero
 *
 * email:   paulo.marquez@gmail.com / me@pmarquezh.info
 * twitter: @pauloemarquez
 * github:  https://github.com/pmarquez
 * blog:    http://ruminationsontechnology.blogspot.com.es/
 *
 * The code included in this tutorial is not guaranteed to work 
 * in a production environment or be fit for any particular purpose 
 * other that to showcase the technology related to this tutorial.
 */

package com.pmarquezh.alottaparking.parkinglot;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.websocket.*;

/**
 *    This Encoder transforms the list of update objects into a JSON representation. 
 * 
 *    I used Java's own JSONObject library for this task. Included from Java EE7 and on. 
*/
public class MonitorUpdateEncoder implements Encoder.Text<ParkingLotsUpdate> {
    
    @Override
    public void init ( EndpointConfig config ) { }
    
    @Override
    public void destroy ( ) { }
    
    @Override
    public String encode ( ParkingLotsUpdate plu ) {
        
        
        JsonArrayBuilder ab = Json.createArrayBuilder ( );
        
        for ( ParkingLotRec r : plu.getLots ( ) ) {
            ab.add ( Json.createObjectBuilder ( )
                        .add ( "plName", r.getPlName                  ( ) )
                        .add ( "plCapacity", r.getPlCapacity          ( ) )
                        .add ( "plUsedCapacity", r.getPlUsedCapacity  ( ) )
                   );
        }
        
        JsonObject parkingInfo = Json.createObjectBuilder ( )
                                 .add ( "lotsMonitor", ab ).build ( );
        
        return parkingInfo.toString ( );
    }
       
}
