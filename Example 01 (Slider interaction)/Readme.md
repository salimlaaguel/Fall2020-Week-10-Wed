## Slider Control Update Date
#### HTML Control
slider control is an html input element with type range
```
    <label for="theSlider">count to show
    </label>
    <input type="range" value="40" min="1" max="40" id="theSlider">
```
#### Listening to changes 
we can add an event handler that listens to changes of an input control
```
d3.select("#theSlider").
    on("input", function() {
    let count = +this.value; // get the value of the slider
    ...
    });
```
#### Update svg elements using slider
Using enter,exit and remove it is possible to update the svg elements
```
// assign data
let circles =svg.selectAll('circle').data(data) 

//remove extra circles
circles.exit().remove();

// append new elements
circles.enter().append('circle')
```