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

$( function ( ) {
    var websocket;

    var openConnectionButton        = $( "#btnOpenConnection"        );
    var startMonitorButton          = $( "#btnStartMonitor"          );
    var stopMonitorButton           = $( "#btnStopMonitor"           );
    var closeServerConnectionButton = $( "#btnCloseServerConnection" );

//   Bar Chart - BEGIN
    var chartOutput = $( "#chart" );
    var myChart = { "alpha":1,
                    "background-color":"#f5f5f5",
                    "background-color-2":"#f5f5f5",
                    "type" : "hbar",
                    "stacked" : "true",
                    "title": { "text":"A-Lotta-Parking Monitor",
                               "alpha":1,
                               "background-color":"#5090cd",
                               "background-color-2":"#5090cd",
                               "position":"0% 0%",
                               "margin-top":0,
                               "margin-right":0,
                               "margin-left":0,
                               "margin-bottom":10,
                               "color":"#ffffff" },

                    "scale-y": { "label": { "text":"Percentage Occupation" } },
                    
                    "series": [ { "values": [ ] }, 
                                { "values": [ ] } ] 
                  };
//   Bar Chart - END

    init ( );   //   Set-up the magic.

    function init ( ) {

        //   Setup all button and event listeners
        openConnectionButton.on         ( "click", openSocketConnection  );
        startMonitorButton.on           ( "click", sendStartCommand      );
        stopMonitorButton.on            ( "click", sendStopCommand       );
        closeServerConnectionButton.on  ( "click", sendCloseCommand      );
        window.addEventListener         ( "beforeunload", destroy, false );

        //   Initialize the chart object
        chartOutput.zingchart ( );
        chartOutput.zingchart ( { JSON: myChart } );
    }

//   WebSocket Lifecycle - BEGIN
    function openSocketConnection ( ) {
        
        //   Create the WebSocket
        websocket = new WebSocket ( "ws://localhost:8084/A-Lotta-Parking/parkingLotUpdates" );

        //   When the server messages the client, we receive the message here.
        websocket.onmessage = function ( evt ) {

            var obj = $.parseJSON( evt.data );
            if ( obj.lotsMonitor !== undefined ) { processSnapshot   ( obj ); }
        };

        //   When the server closes the WebSocket, we receive the notification here.
        websocket.onclose = function ( evt ) {
            //alert("Server closed WebSocket");
        };

        //   Set html buttons state
        buttonStates ( "openedState" );

    }

    //   When the client requests to start the monitoring, we sent the "startMonitor" message here.
    function sendStartCommand ( ) {
        websocket.send ( "startMonitor" ); 

        //   Set html buttons state
        buttonStates ( "startedState" );
        
    }

    //   When the client requests to stop the monitoring, we sent the "stopMonitor" message here.
    function sendStopCommand ( ) {
        websocket.send ( "stopMonitor" ); 

        //   Set html buttons state
        buttonStates ( "stoppedState" );
    
    }

    //   When the client requests that the server close the websocket, we send the "closeConnection" here.
    //   
    //   Of course, as a client, we have the power to close the websocket connection from
    //   the client side using "websocket.close()". I just chose to do it in a different 
    //   fashion and politely request the server to do so on our behalf.
    //   
    //   In this tutorial, we are also using the other method, we are listening to the "beforeunload" event, 
    //   which is triggered when the user closes the browser window, in that case, we close the WebSocket from 
    //   the client side (as can be seen in the "destroy" function a few linea ahead.
    function sendCloseCommand ( ) {
        websocket.send ( "closeConnection" ); 

        //   Set html buttons state
        buttonStates ( "closedState" );

    }

    //   Closes the WebSocket connection from the client side.
    function closeSocketConnection ( ) {
        websocket.close ( );
    }

    //   We are exiting, close everything.
    function destroy ( ) {
        sendStopCommand       ( );
        closeSocketConnection ( );
    }
//   WebSocket Lifecycle - END


//   Chart and Table Processing - BEGIN
    function processSnapshot ( obj ) {
        processDataForChart ( obj );
        processDataForTable ( obj );
    }

    function processDataForChart ( obj ) {

        var seriesObject = { series: [ ] };
        
        var series1Item = { values: [] };
        var series2Item = { values: [] };

        $.each ( obj.lotsMonitor, function ( idx, lot ) {
            var usedCapacityPercentage = Math.ceil ( ( lot.plUsedCapacity / lot.plCapacity ) * 100 );

            series1Item.values.push ( usedCapacityPercentage );
            series2Item.values.push ( 100 - usedCapacityPercentage );

        } );
        
        seriesObject.series.push ( series1Item );
        seriesObject.series.push ( series2Item );

        chartOutput.setJSON ( seriesObject );
    }

    function processDataForTable ( obj ) {

        var tableData = "";
        
        $.each ( obj.lotsMonitor, function ( idx, lot ) {
            tableData += "<tr>";
            tableData += "<td>" + idx + "</td>";
            tableData += "<td>" + lot.plName + "</td>";
            tableData += "<td>" + lot.plCapacity + "</td>";
            tableData += "<td>" + lot.plUsedCapacity + "</td>";
            tableData += "<td>" + Math.ceil ( ( lot.plUsedCapacity / lot.plCapacity ) * 100 ) + "%</td>";
            tableData += "<tr>";
        } );
        
        $("#tableData").html ( tableData );
    }
//   Chart and Table Processing - END

//   Button States - BEGIN
    function buttonStates ( state ) {
        switch ( state ) {
            case "openedState":
                openConnectionButton.attr              ( "disabled", "disabled" );
                startMonitorButton.removeAttr          ( "disabled" );
                stopMonitorButton.attr                 ( "disabled", "disabled" );
                closeServerConnectionButton.removeAttr ( "disabled" );
                break;
                
            case "startedState":
                openConnectionButton.attr              ( "disabled", "disabled" );
                startMonitorButton.attr                ( "disabled", "disabled" );
                stopMonitorButton.removeAttr           ( "disabled" );
                closeServerConnectionButton.removeAttr ( "disabled" );
                break;
                
            case "stoppedState":
                openConnectionButton.attr              ( "disabled", "disabled" );
                startMonitorButton.removeAttr          ( "disabled" );
                stopMonitorButton.attr                 ( "disabled", "disabled" );
                closeServerConnectionButton.removeAttr ( "disabled" );
                break;
                
            case "closedState":
                openConnectionButton.removeAttr        ( "disabled" );
                startMonitorButton.attr                ( "disabled", "disabled" );
                stopMonitorButton.attr                 ( "disabled", "disabled" );
                closeServerConnectionButton.attr       ( "disabled", "disabled" );
                break;
                
            default:
                message ( "Huh!? what's just happened?" );
                
        }
    }
//   Button States - END

} );