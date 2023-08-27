<div align="center">
<img width=200 src="https://avatars.githubusercontent.com/u/125645342?s=400&u=3b826dc69690dbe5a25e243508bfb29d9a48d8a1&v=4">

# [ESP32-COOP-DOOR](https://coop-door.vercel.app/)

Coop Door wireless control App 


</div>



# :dart: Goal
The goal is to make a simple mobile interface to setup your coop door over Bluetooth low energy

# :jigsaw: Functionality
Here are the settings that the app via bluetooth allow you to edit on the coop door:
- opening condition:
    - ambient brightness above *light value*
    - AND / OR
    - time past *time*
- closing condition:
    - ambient brightness below *light value*
    - AND / OR
    - time past *time*
- door setup
    - number of turn for opening/closing
    - test number of turn
    - status open / close / auto

# :arrows_counterclockwise: Workflow
here is an example of a sketch and the final result :

<div>
<img height=400 src="README/sketch.png" alt="sketch">
<img height=400 src="README/result.png" alt="result">
</div>

# :video_camera: Demo

Here is a simple demo of the current functionality

<img height=400 src="README/demo.gif" alt="demo">

# :clipboard: Todo

- [x] Setup basic Svelte Kit
- [x] Layout different pages
- [x] Add interactive functionalities
- [x] Integrate Ble lib
- [x] Finish integration with [ESP32-COOP-DOOR-CORE](https://github.com/ESP32-COOP/ESP32-COOP-DOOR-CORE)
