/*
Copyright 2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Declare dependencies
/* global fluid */

(function ($) {
    "use strict";

    fluid.setLogging(true);

    fluid.registerNamespace("examples");
    
    var model = {
      temperature: 25
    };
    console.log(model);
    var transform = {
      transform: {
          type: "fluid.transforms.linearScale",
          valuePath: "temperature",
          outputPath: "temperature",
          factor: 9/5,
          offset: 32
      }
    };
    var outputModel = fluid.model.transformWithRules(model, transform);
    console.log("Transformed model: ", outputModel);
    
    fluid.defaults("examples.transformComponent", {
      gradeNames: ["fluid.modelRelayComponent", "autoInit"],
      model: {
        celsius: 25
      },
      modelRelay: {
        source: "celsius",
        target: "fahrenheit",
        singleTransform: {
          type: "fluid.transforms.linearScale",
          factor: 9/5,
          offset: 32
        }
      },
      modelListeners: {
        fahrenheit: "examples.listenFahrenheit"
        /* fahrenheit: {
            func: "examples.listenFahrenheitBad",
            args: ["{that}", "{change}"]
        }*/
      }
    });
    
    examples.listenFahrenheit = function (change) {
        console.log("Listener observed fahrenheit value changing from " + change.oldValue + " to " + change.value);
    };
    
    examples.listenFahrenheitBad = function (that, change) {
        console.log("Listener observed fahrenheit value changing from " + change.oldValue + " to " + change.value);
        that.applier.change("oldFahrenheit", change.oldValue);
    };
    
    var that = examples.transformComponent();
    
    console.log("Initial celsius value: ", that.model.celsius);
    console.log("Initial fahrenheit value: ", that.model.fahrenheit);
    // console.log("Initial old fahrenheit value", that.model.oldFahrenheit);
    
    that.applier.change("fahrenheit", 451);
    
    console.log("Fahrenheit value now updated to ", that.model.fahrenheit);
    console.log("Celsius value now updated to ", that.model.celsius);
    // console.log("Updated old fahrenheit value", that.model.oldFahrenheit);    
})(jQuery);