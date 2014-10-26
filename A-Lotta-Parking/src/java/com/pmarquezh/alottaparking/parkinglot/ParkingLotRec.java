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

public class ParkingLotRec {
    private String plName;
    private int    plCapacity;
    private int    plUsedCapacity;

    public ParkingLotRec ( String plName, 
                           int    plCapacity, 
                           int    plUsedCapacity ) {
        
        this.plName                = plName;
        this.plCapacity            = plCapacity;
        this.plUsedCapacity        = plUsedCapacity;

    }

    /**
     * @return the plName
     */
    public String getPlName() {
        return plName;
    }

    /**
     * @param plName the plName to set
     */
    public void setPlName(String plName) {
        this.plName = plName;
    }

    /**
     * @return the plCapacity
     */
    public int getPlCapacity() {
        return plCapacity;
    }

    /**
     * @param plCapacity the plCapacity to set
     */
    public void setPlCapacity(int plCapacity) {
        this.plCapacity = plCapacity;
    }

    /**
     * @return the plUsedCapacity
     */
    public int getPlUsedCapacity() {
        return plUsedCapacity;
    }

    /**
     * @param plUsedCapacity the plUsedCapacity to set
     */
    public void setPlUsedCapacity(int plUsedCapacity) {
        this.plUsedCapacity = plUsedCapacity;
    }

}
