
  $(function()
  {
    let quizData = content[current_question - 1]

    // 3) render the options
    const $opts = $('#quiz-options').empty();
    quizData.options.forEach(opt => {
      const $col = $('<div class="col-6"></div>');
      const $btn = $(`
        <button type="button"
                class="quiz-option btn btn-md "
                style = "color: black; border: black solid 1px"
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
        .removeClass('btn btn-md bg-base')
        .addClass('btn');
      
      // activate this one
      $(this)
        .removeClass('btn-outline-secondary')
        .addClass('btn bg-base');
      console.log('Selected answer:', $(this).data('value'));

      let answer = $(this).data('value');
      save_answer(answer, current_question);
    });

    toggleLoaded();
  });


// Toggles values that have been saved
function toggleLoaded() 
{
  const value = content[current_question - 1]['user'];    // e.g. ['E', 'A', '', 'D', ...]
  console.log("here")
  console.log(value)

  let $btn = $(`button[data-value="${value}"]`);
  $btn.removeClass('btn-outline-secondary').addClass('btn btn-md bg-base');
}