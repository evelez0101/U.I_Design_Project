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
          current_question = result["current_question"];
          display_question();
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
            current_question = result["current_question"];
            display_question();
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

function display_question()
{
 
  // build the HTML using a template‐literal
  const questionHTML = $(`
  <div class="row">
    <div class="col d-flex justify-content-center">
      <h3>
        Question ${current_question}: ${content[current_question - 1].task}
      </h3>
    </div>
  </div>
  <div class="row">
    <div class="col d-flex justify-content-center">
      <p>
        ${content[current_question - 1].directions}
      </p>
    </div>
  </div>`);
  
  console.log(questionHTML)
  // append it to your target container
  $('#question_text').empty();
  $('#question_text').append(questionHTML);
}

// Handles saving answer
function save_answer(answer, question_num)
{
    console.log("save called");
    console.log(answer)
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
            console.log(result['quiz_content']);
            content[current_question - 1] = result['quiz_content']
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
  let endpoint = "";

  switch(question_num)
  {
    case 1:
      endpoint = "/chord_quiz";
      break;
    case 2:
      endpoint = "/multiple_choice";
      break;
    default:
      endpoint = "/chord_quiz";
  }

  console.log(endpoint)
  $.ajax({
    url: endpoint,       // Flask route
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
      $("#question").empty();
    }
  });
}

// Progress bar
$(document).ready(function() 
{
  // Initialize progress bar 
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
        $("#alert").empty();
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
        $("#alert").empty();
        current--;
        prev_question();
        updateProgress();
      }
    });

    display_question();
});


// Defines behavoir for check answer button
$(document).ready(function()
{
    $('#getAnswersBtn').on('click', function()
    {
      
      if (checkAnswers())
      {
        alert = $(`<div class="alert alert-success" role="alert">
        That is Correct!
          </div>`);
      }
      else
      {
        alert = $(`<div class="alert alert-secondary" role="alert">
        That is Wrong!
          </div>`);
      }

      $("#alert").empty();
      $("#alert").append(alert);
    });
});

function checkAnswers()
{
  let userAnswer = content[current_question - 1]['user']
  let answer = content[current_question - 1]['answer']

  console.log(userAnswer);
  console.log(answer);

  if (Array.isArray(answer)) 
  {
    return (arraysEqual(userAnswer,answer));
  }
 
  return(userAnswer === answer);
}

function arraysEqual(a, b) 
{
  return ( Array.isArray(a) && Array.isArray(b) &&      // both must be arrays
            a.length === b.length &&                      // same length
            a.every((el, i) => el === b[i])               // each element equal
          );
}