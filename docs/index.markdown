## link.set(name:String, value)
Set `name` in the configuration to `value`


## link.connect(name:String, callback:Function(room:Room))
Connect to `name` and call the callback once the connection has succeeded. If there is no connection `name`, one will be created on the server.



# Room

## Room::on(event:String, callback:Function)
Bind `callback` to the given `event`. This function will be called whenever a user emits the given `event`. The `this` keyword in this callback will refer to the User who emitted the event.

## Room::emit(event:String[, arguments...])
Send a message on `event` with given `arguments`.

## Event: join
The `join` event will emit whenever a new user connects to the room.



# User

## User::on(event:String, callback:Function)
Listens for events only on the user represented by `User`.

## User::emit(event:String[, arguments...])
Emit an event targeted at only the user represented by `User`.