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

public interface ParkingLotsDataSourceListener {
    
    public void handleParkingLotUsageData ( ParkingLotsUpdate plu );
    
}
