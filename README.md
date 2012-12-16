# Relay

A JavaScript testing framework doesn't have to be complicated.

## No Asynchronous Mess

You can be assured a test block runs reliably, isolated from all other execution. Code inside `runs`, `beforeEach`, and `afterEach` must call the callback argument in order for Relay to proceed.

## Minimal Feature Set with Listeners

There isn't much code driving the core of Relay. Relay uses an observer pattern to allow new features to be added on a need-by-need basis. Listener objects can be created to subscribe to event notifications, like `onRelayStart`, `onRelayEnd`, `onEnter`, and `onExit`.