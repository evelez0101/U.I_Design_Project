// On Start Functions 

// Hide warning messages by default
$(document).ready(function()
{   
    $("#reams-warning-message-1").hide()
    $("#reams-warning-message-2").hide()
    $("#client-warning-message").hide()
})

// Auto Complete Feature
$(document).ready(function()
{       
    $("#client").autocomplete(
    {
        source: clients
    });
});

// Populate Logs on start
$(document).ready(function() 
{
   display_sales_list(sales);
});


// Handles Saving
function save_sale (new_sale)
{    
    // Call to backend  
    $.ajax({
        type: "POST",
        url: "save_sale",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(new_sale),
        success: function(result)
        {
            let all_data = result["sales"]

            // update clients list
            clients = result["clients"]

            // Update autofill
            $("#client").autocomplete(
            {
                source: clients
            });

            // console.log("success save_sale")
            console.log("test: " +  result["clients"])
            data = all_data
            
            // Display Sales
            display_sales_list(data)

             //clears text boxes and focuses on client input box
            $("#client").val("").focus();
            $("#reams").val("");

            console.log(data)
        },
        error: function(request, status, error)
        {
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

// Handles Save logic and makes save_sale call when ready
function addSale()
{
    const salesperson = "Evelio G. Velez";
    let client  = $("#client").val();
    let reams = $("#reams").val();

    // Add entry to the sales list
    new_sale = ({
                "salesperson": salesperson,
                "client": client,
                "reams": reams
                });

    // Validate input
    if (isInfoValid())
    {
        save_sale(new_sale);
    }

}

// Validates Input
function isInfoValid()
{
    let reams = $("#reams").val().trim().length;
    let client = $("#client").val().trim().length;

    let value = $("#reams").val();

    returnValue = true;

    // check length for clien
    if (client == 0)
    {
        $("#client-warning-message").show(); // Hide warning
        $("#client").focus();
        returnValue = false;
    }
    else
    {
        $("#client-warning-message").hide(); // Hide warning
    }
                
    // Check to see if value is only numbers
    if (! $.isNumeric(value)) 
    {
        $("#reams-warning-message-1").show(); // Show warning
        $("#reams").focus();
        returnValue = false;
    } 
    else
    {
        $("#reams-warning-message-1").hide();
    }
    
    // Check length for reams
    if (reams == 0)
    {
        $("#reams-warning-message-2").show(); // Hide warning
        $("#reams").focus();
        returnValue = false;
    }
    else
    {
        $("#reams-warning-message-2").hide(); // Hide warning
    }

    return returnValue;
}

// Press enter to submit
$(document).ready(function()
{ 
    $("#reams").keydown(function(event)
    {
        // Checks to see if tweet is the valid length and valid content
        if ( (event.key == "Enter") )
        {
            addSale();
        }
    })
});

// Press Sumut to add a new log
$(document).ready(function()
{   
    $("#submit").click(function()
    {
        addSale();
    })
});

// Handles deleting
function delete_sale (id)
{
    
    // Call to backend  
    $.ajax({
        type: "POST",
        url: "delete_sale",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(id),
        success: function(result)
        {
            let all_data = result["sales"]

            console.log("success delete_sale")
            console.log("test: " +  result["sales"])
            sales = all_data
            
            // Update View
            display_sales_list(sales)

            console.log(sales)
        },
        error: function(request, status, error)
        {
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });

}

// Delete a log using button
$(document).on("click", ".btn-warning.remove-row", function()
{
    // Get the index of the clicked entry
    let index = parseInt($(this).attr("id"));

    console.log(index);
        
    // Remove it from the list
    delete_sale(index);
});

// Delete a log using drag
$(function() 
{
    $( ".draggable" ).draggable({revert: "invalid" });
    $( "#droppable" ).droppable(
    {
        // Change draggable object background color
        over: function(event, ui ) 
        {
            $(this).css("background-color", "yellow"); 
        },
        out: function(event, ui) 
        {
            $(this).css("background-color", "lightgrey"); 
        },
        drop: function( event, ui ) 
        {
            $(this).addClass( "ui-state-highlight" );

            // Get the index of the clicked entry
            let index = parseInt(ui.helper.attr("id"));

            // Remove it from the list
            delete_sale(index);

            // Reset after a delay
            setTimeout(() => {
               // Reset droppable styles
               $(this).removeClass("ui-state-highlight");
               $(this).css("background-color", "lightgray"); 
            }, 500);
           
        }
    });
});

// Handles Displaying data
function display_sales_list(sales)
{
    // Clear the screen first
    clearUI();

    // Then populate each sale
    for (let i = 0; i < sales.length; i++)
    {
        sale = sales[i];
        createLog(sale.salesperson, sale.client, sale.reams, sale.id);
    }

    // reinitialize dragable
    $(".draggable").draggable({revert: "invalid"});
}

function clearUI()
{
    $("#container").html("");
}

function createLog(salesperson,client,reams,index)
{
    let newLog = $(`
                    <br>
                    <div class = "draggable" id = "${index}">
                        <div class="row">
                            <div class="col-3">
                                ${salesperson}
                            </div>
                            <div class="col-4">
                                ${client}
                            </div>
                            <div class="col-3">
                                ${reams}
                            </div>
                            <div class="col-1">
                                <button type="button" id = "${index}" class="btn btn-warning remove-row">X</button>
                            </div>
                        </div>
                    </div>
                    `);
    
    $("#container").prepend(newLog);
}

// Change cursor to 'move' on hover
$(document).on("mouseenter", ".draggable", function() {
    $(this).css({ "cursor": "move", "background-color": "lightyellow" });
});

$(document).on("mouseleave", ".draggable", function() {
    $(this).css("background-color", "white");
});