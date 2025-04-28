// Handles prev question logic
function prev_question()
{
  $.ajax({
      type: "POST",
      url: "prev_question",                
      dataType : "json",
      contentType: "application/json; charset=utf-8",
      data : " ",
      success: function(result)
      {
          console.log("Decrement Increment")
          request_question(result["current_question"]);
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


// Handles next question logic
function next_question()
{

    $.ajax({
        type: "POST",
        url: "next_question",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : " ",
        success: function(result)
        {
            console.log("success Increment")

            request_question(result["current_question"]);
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

// Handles saving answer
function save_answer(answer, question_num)
{
    // Call to backend  
    let data = [answer, question_num];

    $.ajax({
        type: "POST",
        url: "save_answer",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(data),
        success: function(result)
        {
            console.log("success save_answer")
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


function request_question(question_num)
{
  $.ajax({
    url: "/chord_quiz",       // Flask route
    method: "GET",
    dataType: "html",      // expect HTML back
    success: function(html) {
      // inject the snippet into the container
      $("#question").empty();
      $("#question").append(html);
      console.log(html)
    },
    error: function(xhr, status, err) {
      console.error("AJAX error:", status, err);
    }
  });
}

// Progress bar
$(document).ready(function() 
{
    const $steps = $('.progressbar li');
    const total  = $steps.length;
    let current  = current_question;
    request_question(current_question);

    function updateProgress() 
    {
        $steps.each(function(i) 
        {
            if (i < current - 1) 
            {
                $(this).addClass('done').removeClass('active');
            } 
            else if (i === current - 1) 
            {
                $(this).addClass('active').removeClass('done');
            } 
            else 
            {
                $(this).removeClass('done active');
            }
        });

      // Buttons
      $('#prev').prop('disabled', current === 1);
      $('#next').prop('disabled', current === total);
    }

    updateProgress();

    // Present the next question
    $(document).on("click", "#next", function()
    {
      if (current < total) 
      {
        current++;
        next_question();
        updateProgress();
      }
    });

    // Present the prev question
    $(document).on("click", "#prev", function()
    {
      if (current > 1) 
      {
          current--;
          prev_question();
          updateProgress();
      }
    });
});