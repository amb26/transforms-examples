Infusion Transformation Examples
===

This repository contains codealong examples that were presented at the GPII
Hackathon held at HCII 2014, Crete, 24th June 2014.

Installation instructions:
-

Firstly, install node and npm.

Run the following command in your newly checked out repository. This
will install the Fluid Infusion snapshot that is required by the examples.

    npm install
    
You can then load the transforms.html file in your browser and observe the 
message log in the console.

Discussion of the example:
-

The main homepage for Fluid's Infusion framework is held at http://fluidproject.org/products/infusion/ .

Notable new features in the 1.5 release relate to the model transformation framework
and the model relay system.

### Single-shot transformation

This example begins with a simple direct use of the model transformation system to
transform an entire model document in a one-shot process - this uses the 
`fluid.model.transformWithRules` framework API which is documented at http://wiki.fluidproject.org/display/docs/fluid.model.transformWithRules .
The available transformation functions for use with this API are documented at 
[Available transformation function](http://wiki.gpii.net/w/Architecture_-_Available_transformation_functions)

### Dynamic transformation (using a relay-aware component)

Following this is a more complex example showing the dynamic behaviour of 
transformations together with the model relay system. We use the same transformation, written
in the `modelRelay` section of its options,
to initialise part of the model of a 
[`fluid.modelRelayComponent`](http://wiki.fluidproject.org/display/docs/Model+Relay). 
This relay definition operates 
a _lens_ to establish a consistent initial value for the `fahrenheit` field in the model,
by acting on the `celsius` field with its given initial value.

#### The initial transaction

This initialisation process operates what is described in the http://wiki.fluidproject.org/display/docs/Model+Relay
description page as the _initial transaction_. During this transaction, the complete set of
relay rules (both implicit and explicit) as well as the complete set of initial provided
values for model fields, are all pooled together and then the transforms operated to
bring the model into a consistent condition.

From the point of view of any observers (registered as `modelListeners`), this update
process is atomic. At the close of the initial transaction, all registered listeners will
observe their respective model fields being updated from their standard initial values of
`undefined` to hold their initialised consistent values. The `listenFahrenheit` listener
in this way reports to the console:


    Listener observed fahrenheit value changing from undefined to 77
 

Note that this report is emitted _before_ the component's creator function (its "constructor"
in OO terminology). After the report from the `listenFahrenheit` listener triggered by
the initial transaction, we receive the reports from the main sequence of our example
code listing the initial consistent values of the component model fields.

#### Triggering a change at runtime

After the initial transaction, we then explicitly trigger a fresh change, from the far end of
the lens, using the [ChangeApplier API](http://wiki.fluidproject.org/display/docs/ChangeApplier+API) attached to the component's model:


    that.applier.change("fahrenheit", 451);


This triggers a fresh update transaction during which the lens operates again to bring the
model to a consistent condition - this time in the opposite direction by propagating the 
update from the fahrenheit field back to the celsius field. The `fahrenheitListner` triggers
again and we report final values

### Further IoC topics with relay

Commented out in the implementation we have a more advanced listener definition,
using IoC facilities to "boil" the framework-supplied argument list into a custom one
supplied in the listener definition. 

During the codealong we mentioned that in cases where the model relay framework can't
yet operate some required behaviour (whether due to a bug or other implementation
limitation) it is possible to schedule model changes to be triggered manually.
The example contains some commented-out code which registers a different model 
listener than the standard `listenFahrenheit` entitled `listenFahrenheitBad`. This
is registered using a more full IoC record which instructs the framework that this
listener accepts a different argument, including a reference to the entire component
in the 1st position, with the standard argument ```{change}``` in position 2:


    fahrenheit: {
        func: "examples.listenFahrenheitBad",
        args: ["{that}", "{change}"]
    }


Given this listener is given the full affordances of the component, it can use its
ChangeApplier to trigger a change in reaction to an existing one - note that this
kind of implementation can be subject to many problems, including infinite cycles
of change triggering and the requirement for much closer reading of the code and
configuration in order to check and understand its behaviour. We promote the use
of purely declarative binding and relay styles wherever they can be used, given
that this kind of use of [invariant-based programing](http://en.wikipedia.org/wiki/Invariant-based_programming)
makes it much easier to understand and reason about the program's activity (as well 
as to represent and modify it using non-textual tools).