
$(document).ready(function() 
{
    const $steps = $('.progressbar li');
    const total  = $steps.length;
    let current  = content.order;

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
        $('#prevBtn').prop('disabled', current === 1);
        $('#nextBtn').prop('disabled', current === total);
    }

    $('#nextBtn').click(() => 
    {
        if (current < total) 
        {
            current++;
            updateProgress();
        }
    });

    $('#prevBtn').click(() => 
    {
        if (current > 1) 
        {
            current--;
            updateProgress();
        }
    });

    // (Optional) allow clicking on the circles
    $steps.click(function() 
    {
        current = $(this).index() + 1;
        updateProgress();
    });

    updateProgress();
});

$(document).ready(function() 
{
    let percentage = (100 / content.future_lessons.length);
    $('.progressbar li').css('width', percentage + '%');
});