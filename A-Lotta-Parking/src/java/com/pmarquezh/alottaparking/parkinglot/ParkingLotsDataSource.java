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
 *
 * The code in this class is partially based on what I learned about 
 * websockets from Dr. Danny Coward's awesome book: 
 *
 *    Java WebSocket Programming [ISBN-13: 978-0071827195 | ISBN-10: 0071827196] 
 *
 * which I consider it to be the ultimate reference in WebSockets if 
 * you program in Java.
 *
 */

package com.pmarquezh.alottaparking.parkinglot;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ParkingLotsDataSource {
    
    private final List<ParkingLotsDataSourceListener> listeners;

    private Thread              updateThread;
    private boolean             shouldUpdate;
    
    //   The names of our parking lots.
    private String [ ]          lotNames = { "Elm St.", 
                                             "Roosevelt Ave.", 
                                             "Olympic Stadium", 
                                             "Airport", 
                                             "Campus Ave.", 
                                             "Planetarium" };
    
    private final List<String>  parkingLots;
    private List<ParkingLotRec> parkingLotsUsage;
    
    private final int           averageParkingLotUpdatePeriod; 
       
    public ParkingLotsDataSource ( ) {
        this.listeners                     = new ArrayList < > ( );
        
        this.averageParkingLotUpdatePeriod = 750;   //  ms.
        
        this.parkingLots                   = new ArrayList < > ( );
        this.parkingLots.addAll ( Arrays.asList ( lotNames ) );

        this.parkingLotsUsage  = this.getUsage ( );
    }
    
    private List<ParkingLotRec> getUsage ( ) {
        List<ParkingLotRec> lotsUsage = new ArrayList<> ( ); 
        for ( String lotName : this.parkingLots ) {
            lotsUsage.add ( this.computeUsageDataFor ( lotName ) );
        }
        return lotsUsage;
    }

    //   Method that registers a new listener
    public void addParkingLotDataSourceListener ( ParkingLotsDataSourceListener listener ) {
        this.listeners.add ( listener );
    }
    

    //   Create a new thread to simulate incoming data from the different parking lots.
    public void start ( ) {

        if ( this.updateThread == null ) {
            
            shouldUpdate = true;
            
            updateThread = new Thread ( ) {
                @Override
                public void run ( ) {
                    while ( shouldUpdate ) {
                        doUpdate ( );
                        try { 
                            Thread.sleep ( generateRandomParkingLotUpdatePeriod ( ) ); 
                        } catch ( InterruptedException ie ) {
                            System.out.println ( "updateThread.run ( ): " + ie.getMessage ( ) );
                            shouldUpdate = false;
                        }
                    }
                }
            };
            
            updateThread.start ( );

        }
    }

    //   Update the parking lot usage. Invoked from "updateThread"
    public void doUpdate ( ) {
        this.updateUsage ( ); 
        this.notifyListeners ( parkingLotsUsage );
    }    
    
    //   Broadcast the new data to registered listeners
    private void notifyListeners ( List<ParkingLotRec> lots ) {
        for ( ParkingLotsDataSourceListener l : this.listeners ) {
            ParkingLotsUpdate plu = new ParkingLotsUpdate ( lots );
            l.handleParkingLotUsageData ( plu );
        }       
    }

    //   Notify the simulation thread that we are closing shop.
    public void stop ( ) {
        this.updateThread.interrupt ( );
    }

//   SIMULATION RELATED METHODS - BEGIN
    
    public ParkingLotRec computeUsageDataFor ( String lot ) {
       switch ( lot ) {
           case "Elm St.":
               return new ParkingLotRec ( lot,  185, this.computeUsage (  120,  2 ) );

           case "Roosevelt Ave.": 
               return new ParkingLotRec ( lot,  457, this.computeUsage (   70,  4 ) );
           
           case "Olympic Stadium": 
               return new ParkingLotRec ( lot, 1820, this.computeUsage (  600,  9 ) );
           
           case "Airport": 
               return new ParkingLotRec ( lot, 2457, this.computeUsage ( 1500, 12 ) );
           
           case "Campus Ave.": 
               return new ParkingLotRec ( lot,  753, this.computeUsage (  320,  5 ) );
           
           case "Planetarium": 
               return new ParkingLotRec ( lot,  417, this.computeUsage (  180,  6 ) );
           
           default:
               throw new RuntimeException ( "Parking lot '" + lot + "' does not exist." );
       }            
    }
    
    private int computeUsage ( int guide, int maxChange ) {
        double rand   = Math.random ( );
        double change = maxChange * 3 * ( rand );
        
        return new Double ( guide + change ). intValue ( );  
    }
    
    private void updateUsage ( ) {
        List<ParkingLotRec> quotes      = this.getUsage ( );
        List<ParkingLotRec> stocksToUse = new ArrayList < > ( );
        
        for ( int i = 0; i < quotes.size ( ); i++ ) {
            if ( this.generateRandomOnOff ( ) ) {
                stocksToUse.add ( quotes.get ( i ) );
            } else {
                stocksToUse.add ( parkingLotsUsage.get ( i ) );
            }
        }
        
        parkingLotsUsage = stocksToUse;
    }

    public boolean generateRandomOnOff ( ) {
        int i = Math.round ( ( float ) 0.15 + ( float ) Math.random ( ) );
        return ( i == 0 );
    } 

    public int generateRandomParkingLotUpdatePeriod ( ) {
        return this.averageParkingLotUpdatePeriod + ( int ) ( ( ( float ) 0.5 - ( float ) Math.random ( ) ) * this.averageParkingLotUpdatePeriod );
    }

//   SIMULATION RELATED METHODS - END

}
