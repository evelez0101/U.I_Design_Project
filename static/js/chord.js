// Renders Fretboard 
$(document).ready(function() {
    // Standard tuning, low-E to high-E
    const tuning = ['E','B','G','D','A','E'];
    
    // Note names per semitone (0=C,...11=B)
    const names  = [
      'C','C#','D','D#','E','F',
      'F#','G','G#','A','A#','B'
    ];
    // Map note to semitone index
    const idx = { C:0,'C#':1,D:2,'D#':3,E:4,F:5,
                  'F#':6,G:7,'G#':8,A:9,'A#':10,B:11 };

    const $body = $('#fret-body');

    tuning.forEach((openNote, stringIdx) => {
      
      const $tr = $('<tr>');

      // Left string name
      $tr.append(
        $('<td>').addClass('string-label').text(openNote)
      );

      // Frets 0–6
      for(let fret = 0; fret <= 6; fret++)
      {
        
        const semitone = (idx[openNote] + fret) % 12;
        const note = names[semitone];

        const radioId = `str${stringIdx}_fr${fret}`;

        const $td = $('<td>').addClass('text-center');
        
        if (fret == 0)
        {
            const Id = `str${stringIdx}_fr_closed`
            const $td = $('<td>').addClass('text-center');

            // hidden radio
            const $input = $('<input>')
            .attr({ type:'radio', name:`str${stringIdx}`, value: 'X', id:Id })
            .addClass('fret-radio');

            // visible circle label
            const $label = $('<label>')
            .attr('for', Id)
            .addClass('fret-label')
            .text("X");

            $td.append($input, $label);
            $tr.append($td);
        }

        // hidden radio
        const $input = $('<input>')
          .attr({ type:'radio', name: `str${stringIdx}`, value: note, id:radioId })
          .addClass('fret-radio');

        // visible circle label
        const $label = $('<label>')
          .attr('for', radioId)
          .addClass('fret-label')
          .text(note);

        $td.append($input, $label);
        $tr.append($td);
      } 
      $body.append($tr);
    });

    toggleLoaded();
    checkReadyToSubmit();
  });

// Gets value from each row
function getTableRowValues() 
{
    
    return $('.fretboard tbody tr').map(function() 
    {
      // look inside this row for the checked radio:
      let val = $(this).find('input[type=radio]:checked').val();
      
      // if none checked, return null (or '' if you prefer)
      return val ?? '';
    }).get(); // .get() turns the jQuery collection into a plain JS array
}

// Helper Function
function arraysEqual(a, b) 
{
  return a.length === b.length && a.every((val, idx) => val === b[idx]);
}

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
  
// Ensures only one button per row is clicked
$(document).ready(function()
{
    $('.fretboard').on('click', 'input[type=radio]', function() 
    {
        // find the <tr> this radio lives in, uncheck all its radios except this one
        $(this)
        .closest('tr')
        .find('input[type=radio]')
        .not(this)
        .prop('checked', false)
        // if you’re also using Bootstrap’s btn-group-toggle, remove .active
        .each(function() {
            $(this).closest('label').removeClass('active');
        });
    
        // finally, ensure this label has .active (Bootstrap toggle)
        $(this).closest('label').addClass('active');
    
        // Save the answers
        let answer = getTableRowValues();
        save_answer(answer, current_question);

        // Check to see if the check button can be activated
        checkReadyToSubmit();
    });
});

function checkReadyToSubmit()
{
  let answer = getTableRowValues();

  if (! answer.includes("")){
    $('#getAnswersBtn').prop('disabled', false);
  }
  else
  {
    $('#getAnswersBtn').prop('disabled', true);
  }
}

// Toggles values that have been saved
function toggleLoaded() 
{
  const values = content[current_question - 1]['user'];

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