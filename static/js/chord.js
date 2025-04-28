// Renders Fretboard 
$(document).ready(function() {
    // Standard tuning, low-E to high-E
    const tuning = ['E','A','D','G','B','E'];
    
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
  });

// Gets value from each row
function getTableRowValues() 
{
    
    return $('.fretboard tbody tr').map(function() 
    {
      // look inside this row for the checked radio:
      let val = $(this).find('input[type=radio]:checked').val();
      
      // if none checked, return null (or '' if you prefer)
      return val;
    }).get(); // .get() turns the jQuery collection into a plain JS array
  }
  
// Defines behavoir for check answer button
$(document).ready(function()
{
    $('#getAnswersBtn').on('click', function()
    {
      let answers = getTableRowValues();
      console.log(answers);
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
    });
});
