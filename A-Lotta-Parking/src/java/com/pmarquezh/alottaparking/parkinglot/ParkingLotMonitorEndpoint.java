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

import java.io.IOException;
import javax.websocket.CloseReason;
import javax.websocket.EncodeException;
import javax.websocket.EndpointConfig;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint ( value    = "/parkingLotUpdates", 
                  encoders = { MonitorUpdateEncoder.class } )
public class ParkingLotMonitorEndpoint implements ParkingLotsDataSourceListener {
    private Session               session;
    private ParkingLotsDataSource dataSource;

//   WebSocket Lifecycle methods - BEGIN

    @OnOpen
    public void openConnection ( Session session, EndpointConfig config ) {
        this.session = session;
    }
    
    @OnMessage
    public void handleIncomingMessage ( String command ) {

        switch ( command ) {
            case "startMonitor":
                this.dataSource = new ParkingLotsDataSource ( );
                this.dataSource.addParkingLotDataSourceListener ( this );
                this.dataSource.start ( );
                break;

            case "stopMonitor":
                this.dataSource.stop ( );
                break;

            case "closeConnection":
                try {
                    session.close ( );
                } catch ( IOException ioe ) {
                    System.out.println ( "Error closing session " + ioe.getMessage ( ) );
                }
                break;

            default:
                System.out.println ( "Command received: " + command );
                System.out.println ( "[This should never happen, unless it just happened, in which case, disregard the imposibility of this ever happening. :-)]" );
        }
    }
        
    @OnError
    public void handleError ( Throwable t ) {
        System.out.println ( "Error: " + t.getMessage ( ) );
    }
    
    @OnClose
    public void closeConnection ( CloseReason reason ) {
        System.out.println ( reason.getReasonPhrase ( ) );
        try {
            dataSource.stop ( );
            session.close   ( );
        } catch ( IOException ioe ) {
            System.out.println ( "Error closing session " + ioe.getMessage ( ) );
        }
    }
//   WebSocket Lifecycle methods - END
    
    
    //   Pushes the new data to all connected clients
    @Override
    public void handleParkingLotUsageData ( ParkingLotsUpdate plu ) {
        try {
            session.getBasicRemote ( ).sendObject ( plu );
        } catch ( IOException | EncodeException ioe ) {
            this.handleError ( ioe );
        }
    }    
}
