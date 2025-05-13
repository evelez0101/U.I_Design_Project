
  // Deep‐equals for arrays (works for 1D arrays)
  function arraysEqual(a, b) {
    return Array.isArray(a) &&
           Array.isArray(b) &&
           a.length === b.length &&
           a.every((el, i) => el === b[i]);
  }

  // Check the current answer against the key in `content`
  function checkAnswers() {
    const item       = content[current_question - 1];
    const userAnswer = item.user;
    const answer     = item.answer;

    console.log('Comparing user →', userAnswer, '| answer →', answer);

    if (item.type === "chord") {
      return arraysEqual(userAnswer, answer);
    }
    return userAnswer === answer;
  }


  // ---- AJAX / navigation helpers ----

  function prev_question() {
    $.ajax({
      type: "POST",
      url: "prev_question",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: " ",
      success(result) {
        current_question = result.current_question;
        display_question();
        request_question(content[current_question - 1].type);
      },
      error(req, status, err) {
        console.error("prev_question error:", status, err);
      }
    });
  }

  function next_question() {
    $.ajax({
      type: "POST",
      url: "next_question",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: " ",
      success(result) {
        current_question = result.current_question;
        display_question();
        request_question(content[current_question - 1].type);
      },
      error(req, status, err) {
        console.error("next_question error:", status, err);
      }
    });
  }

  function reset_question() {
    $.ajax({
      type: "POST",
      url: "reset_question",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: " ",
      success() {
        console.log("successful reset");
      },
      error(req, status, err) {
        console.error("reset_question error:", status, err);
      }
    });
  }

  function save_answer(answer, question_num) {
    const payload = [answer, question_num, quiz_id];
    $.ajax({
      type: "POST",
      url: "save_answer",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(payload),
      success(result) {
        console.log("success save_answer", result);
        content[current_question - 1] = result.quiz_content;
      },
      error(req, status, err) {
        console.error("save_answer error:", status, err);
      }
    });
  }

  function request_question(question_type) {
    let endpoint = (question_type === "chord")
      ? "/chord_quiz"
      : "/multiple_choice";

    $.ajax({
      url: endpoint,
      method: "GET",
      dataType: "html",
      success(html) {
        $("#question").empty().append(html);
      },
      error(xhr, status, err) {
        console.error("request_question error:", status, err);
        $("#question").empty();
      }
    });
  }

  function mark_complete(idx) {
    $.ajax({
      type: "POST",
      url: "/mark_complete",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({ idx }),
      success() {
        console.log("success mark_complete");
      },
      error(req, status, err) {
        console.error("mark_complete error:", status, err);
      }
    });
  }


  // ---- DOM & progress handling ----

  function display_question() {
    const q = content[current_question - 1];
    const html = $(`
      <div class="row mt-4">
        <div class="col d-flex justify-content-center">
          <h3 class = "poppins">
            Question ${current_question}: ${q.task}
          </h3>
        </div>
      </div>
      <div class="row">
        <div class="col d-flex justify-content-center">
          <p>${q.directions}</p>
        </div>
      </div>
    `);
    $("#question_text").empty().append(html);
  }


  $(function() {
    // Cache progressbar steps
    const $steps = $('.progressbar li');
    const total  = $steps.length;

    // Sets up progress bar width
    let percentage = (100 / content.length);
    $('.progressbar li').css('width', percentage + '%');

    // Initial load of the first question
    request_question(content[current_question - 1].type);

    // Update the progressbar UI
    function updateProgress() {
      $steps.each(function(i) {
        if (i < current_question - 1) {
          $(this).addClass('done').removeClass('active');
        } else if (i === current_question - 1) {
          $(this).addClass('active').removeClass('done');
        } else {
          $(this).removeClass('done active');
        }
      });

      $('#next').text(current_question === total ? 'Submit' : 'Next');
      $('#prev').prop('disabled', current_question === 1);
    }

    updateProgress();
    display_question();


    // Delegate all clicks so handlers survive any DOM swaps:

    // Next / Submit
    $(document).on('click', '#next', function() {
      if (current_question < total) {
        $('#alert').empty();
        current_question++;
        next_question();
        updateProgress();
      } else {
        reset_question();
        mark_complete(quiz_id);
        window.location.href = `/results/${quiz_id}`;
      }
    });

    // Previous
    $(document).on('click', '#prev', function() {
      if (current_question > 1) {
        $('#alert').empty();
        current_question--;
        prev_question();
        updateProgress();
      }
    });

    // Check Answers
    $(document).on('click', '#getAnswersBtn', function() {

      console.log(content[current_question - 1]);

      const raw       = checkAnswers();
      console.log('checkAnswers() returned:', raw, typeof raw);

      const isCorrect = raw === true;
      const cls       = 'd-flex justify-content-center';
      const msg       = isCorrect ? '<h4 class = "poppins"> That is Correct! </h4>'  
                                  : (`<div class = "gap-2">
                                    <h4 class = "poppins"> That is Wrong!  
                                      <a href="/learn/${content[current_question - 1]["lesson_id"]}" class  ="link-secondary"> Hint Here </a> 
                                    </h4>
                                    </div>`) ;

      $('#alert')
        .empty()
        .append(`<div class="alert ${cls}" role="alert">${msg}</div>`);
    });
  });