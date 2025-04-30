
  $(function()
  {
    let quizData = content[current_question - 1]
    console.log(quizData);

    // 3) render the options
    const $opts = $('#quiz-options').empty();
    quizData.options.forEach(opt => {
      const $col = $('<div class="col-6"></div>');
      const $btn = $(`
        <button type="button"
                class="quiz-option btn btn-outline-secondary"
                data-value="${opt.value}">
          ${opt.value}.) ${opt.text}
        </button>
      `);
      
      $col.append($btn);
      $opts.append($col);
    });

    // 4) wire up the click handler
    $opts.on('click', '.quiz-option', function()
    {
      // reset all
      $('.quiz-option')
        .removeClass('btn-primary')
        .addClass('btn-outline-secondary');
      
        // activate this one
      $(this)
        .removeClass('btn-outline-secondary')
        .addClass('btn-primary');
      console.log('Selected answer:', $(this).data('value'));

      let answer = $(this).data('value');
      save_answer(answer, current_question);
    });
  });

// Defines behavoir for check answer button
$(document).ready(function()
{
    $('#getAnswersBtn').on('click', function()
    {
      let alert;
      let answers = getTableRowValues();
      if (arraysEqual(answers,content[current_question - 1].answer))
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

// Toggles values that have been saved
function toggleLoaded() 
{
  const values = current_answers[1];    // e.g. ['E', 'A', '', 'D', ...]
  
  $('.fretboard tbody tr').each(function(i) 
  {
    const valueToToggle = values[i] || '';
    const $rowInput = $(this).find('input[type="radio"]');

    if (valueToToggle) 
    {
      // scope your selector *within* this row
      const $target = $rowInput.filter('[value="' + valueToToggle + '"]');
      $target.prop('checked', true);
      // if you’re using Bootstrap button-toggles, also toggle the .active class:
      $target.closest('label').addClass('active');
    } 
    else 
    {
      // optional: clear this row
      $rowInput.prop('checked', false)
               .closest('label').removeClass('active');
    }
  });
}