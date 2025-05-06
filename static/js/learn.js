let current  = targetId;

function updateProgress() 
{
    console.log(current);

    const $steps = $('.progressbar li');

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

$(document).ready(function() 
{
    // Sets up progress bar width
    let percentage = (100 / content[0].lessons.length);
    $('.progressbar li').css('width', percentage + '%');

    const $steps = $('.progressbar li');
    const total  = $steps.length;

    updateProgress();

    // Sets up cards
    let $carouselEl = $('#cardCarousel');
    let carousel = new bootstrap.Carousel($carouselEl[0], { wrap: false, interval: false });
    carousel.pause();
    let $items = $carouselEl.find('.carousel-item');

   // Focus on Target
    const $targetItem = $items.filter(`#${targetId}`);

    // 3) Compute its zero-based index among all items
    const targetIndex = $items.index($targetItem);

    // 4) Tell the Carousel to go there
    carousel.to(targetIndex);

    // Defines buttons
    let $nextBtn = $('#next');
    let $prevBtn = $('#back');
    let $slideInput = $('#slideIndex');

    let activeIndex = $items.index($carouselEl.find('.carousel-item.active'));

    function updateControls() 
    {
        let activeIndex = $items.index($carouselEl.find('.carousel-item.active'));
        
        if (activeIndex === total - 1) 
        {
            $nextBtn.text('Finish');
        } 
        else 
        {
            $nextBtn.text('Next');
        }
        
        $prevBtn.prop('disabled', activeIndex === 0);
        $slideInput.val(activeIndex + 1);
    }

    // Initialize value and button state
    updateControls();
    mark_complete(current);

    $nextBtn.on('click', function() 
    {

        if (current < total) 
        {
            next_lesson();
            mark_complete(current);
            carousel.next();
        }
        else
        {
            reset_lesson();
            window.location.href = "/lesson_plan";
        }
    });

    $prevBtn.on('click', function() 
    {
        if (current > 1) 
        {
            prev_lesson();
            updateProgress();
            carousel.prev();
        }
    });

    $carouselEl.on('slid.bs.carousel', updateControls).on('slide.bs.carousel', function() { $slideInput.blur(); });
});

function mark_complete(idx)
{
    let data = {"idx": idx};

    console.log(data)
    
    $.ajax({
        type: "POST",
        url: "/mark_complete",                
        dataType :"json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(data),
        success: function(result)
        {
            console.log("success mark_complete")
        },
        error: function(request, status, error)
        {
            console.log("Error mark complete");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

// Handles prev question logic
function prev_lesson()
{
  $.ajax({
      type: "POST",
      url: "/prev_lesson",                
      dataType : "json",
      contentType: "application/json; charset=utf-8",
      data : " ",
      success: function(result)
      {
        console.log("success prev_lesson")
        current = result["current_lesson_id"];
        updateProgress();
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
function next_lesson()
{
    $.ajax({
        type: "POST",
        url: "/next_lesson",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : " ",
        success: function(result)
        {
            console.log("success next_lesson")
            current = result["current_lesson_id"];
            updateProgress();
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

// Handles reset lesson logic
function reset_lesson()
{
    $.ajax({
        type: "POST",
        url: "/reset_lesson",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : " ",
        success: function(result)
        {
            console.log("success reset_lesson")
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