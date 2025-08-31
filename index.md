---
layout: cv
title: hangyux
pdf: true
---
# HangyuXia

<div id="webaddress">
<i class="fi-mail" style="margin-left:1em"></i>
  <a href="348106768@qq.com" style="margin-left:0.5em">348106768@qq.com</a>
<i class="fi-telephone" style="margin-left:1em"></i>
  <a href="348106768@qq.com" style="margin-left:0.5em">+86-13797506543</a>
<i class="fi-mail" style="margin-left:1em"></i>
  <a href="https://ri77tlp7on3.feishu.cn/drive/folder/XCjqfQeTvlj2RfdVCAKcNF84nud" style="margin-left:0.5em">Personal documentations and practicing demo</a>
</div>


## **Educational BackGround**
### **The University of Melbourne** `2017.2 - 2019.1 @Melbourne，Australia`
- Master of Computer Science M.S.
  
### **HuaZhong Agoricultureal University(211)** `2012.9 - 2016.6 @Wuhan，China`
- Computer Science And Technology B.Eng.
  
## **Work Experience**
### **Guangzhou Kuluo Technology Co., Ltd​** `2024.12 - now`
- UE5 Client Developer（3C, Animation）

### **SHENZHEN IDREAMSKY TECHNOLOGY CO.,LTD.​​** `2020.4 - 2024.11`
- UE4 Client Developer（Gameplay, 3C, Animation）
  
### **Shenzhen Tencent Computer System Co., Ltd.​** `2019.4 - 2020.4`
- TuringLab ​​Automated Test Developer

## **Skills**
### **Framework Skills**
- CMC
  - Tick, RootMotion, DS Autonoumous-Server-Simulated framework.
  - Source code MovmentModes implementation details.
- Animation
  - Deep dive into ALS, Lyra and Locomotion of GASP. Familiar with their animation framework details, and animation asset requirements.
  - Deep dive into UE4 Aniamtion code framework: SkinnedMeshComponent.Tick, AnimationInstance, AnimationProxy.
  - Almost all implementations of AnimNode for UE4, part of UE5(Animation Warping, RootOffset, FootPlacement, LegIK etc.).
  - Deep dive into KawaiiPhysics code implementation.
- UE4 RawInput: Familiar with the progress from winpumpmessage to playerinput and PlayerController TickPlayerInput.
- CameraManager: Familiar with UpdateCamera and viewtarget management.
- Network Replication: RPCs and property replication. Once deep dive into the code.
  - NetDriver dispatch, flush and ServerReplicateActors.
  - Channels, ObjectReplicator, Replayout, ChangeListManager.
- Gameplay framework
  - Initializations of GameMode, GameState, PlayerContoller, PlayerState and Pawn.
  - Client login progress.
    
### **Gameplay Skills**
- Complex movment logic design with CMC.
- Zero to one game animation framework for Shooting games and ARPG games.
- Modular character with one single animation instance.
- Weapon developing, especially for guns.
- Character state machine designs.
- Gameplay developing like game rules, basic uses of GAS, etc.

### **Personal documentations and practicing demo**
- https://ri77tlp7on3.feishu.cn/drive/folder/XCjqfQeTvlj2RfdVCAKcNF84nud?from=space_shared_folder

## **Work Experience**
### **Nami** `2024.12 - now`
 - Animation system refactoring: Mainly for logical decoupling and standarizing the way of code implememtation. This is to make our system stable and extentable.
   - Refactor the management of game animation state. Including parent-child states choosing and switching, state related gameplaytag managing, animation state collaborating with skills and movements.
   - Game state driven locomotion animations(ground, jump, falling etc.) for different character actions. For example, adding special designed animations for a dash skill transferring to land or fall.
 - Animation and movements:
   - Spling running: Customized movement mode, driven by spline data. Works well for high speed moving.
   - Wall moving: Limited requirements for world collisions
     - Dynamic changed player inputs to world acceleration coordinates which takes wall info, camera direction and movement info into account.
     - Allows character to move upside down, and smoothly moving along rough wall or moving across walls with sharp angle.
     - Extra work for interpolating from mesh to rootcomponent.
     - Collision adjustment in narrow space. Characters will never get stuck.
 - Characterized jump actions: Wall move jump, ground edge auto jump, wall edge auto jump. 
   - Different jump animations for each action and camera angle.
   - Animation curve based jump movement control including speed control, gravity control.
 - Refined Walk/Run/Sprint: Stride, playrate, IK & VB. 
   - Smooth transitions between walk-run-sprint and paired blend out skill montage transition animations.
   - HandIK with virtual bone locks assistant hand to counter local space blend and additive.
 - Modular character with one single animation instance: For chaging character skinned parts with part animations.
   - Working as an indivisual plugin, functionalized as a combination of two actor components. It can be used for any actors.
   - Character mesh is composed of several part meshes. Part mesh varies from the part skin player choosen. Two ways provided to compose these meshes:
     - One way is using MergeMesh to merge all selected meshes into one and output all animation bones result to this. This asks for only one skeletalmesh component, but requires extra works for physics assets and morph targets.
     - The other way is using LeaderPoseComponent, multiple part skeletalmesh components and a nude model as leader component. Output all animation bones result to nude model.
     - Both ways ask for a shared skeleton for all participated meshed. And the most important, bind pose of part meshes should never change the bones location of main bodies.
   - Only one animation instance is needed for either of the two ways above. One set of main body animations for all part combinations, including all the walk, run, jump animations and skill animations. Each part mesh should have their own animation set driving themselves only。
   - Also, I slightly modified a bit of the engine code. Animation graph shuold only concentrate on the logic of main body animations, as part animations are automated paired by main body animation names. Part animation bone transforms will be sampled right at the time main body animation sampled, and only the bones part animations tracked will be merged.
   - As for configurations, a structured directory hierachy is needed for this system. The hirerachy specifies each part by ids and their available skins by skin ids. Under the directory of each part skins, several kind of data assets we provided for configuring meshes, animations, effects, audios should be placed. The time a list of parts are asked with their ids and skin ids. These data will be automaticly loaded and maintained by my components.
   - Apart from the asset configurations. I also added a special type of functional data asset called Chooser data asset. The mesh of a part can vary from the other part it connects, we use chooser data asset to config functions(customized class CDO) to choose the right mesh we wanted for different mesh combinations.
 - UE4.27 upgraded to UE5.5.4：Animation and movement。
   - There is not much work about animations. The most important thing I need to do is figuring out all the engine code we have modified for the part of animation, and make a decision of what we should keep.
   - Things are more complicated when it goes to movment. This is mainly because we have changed the engine code a lot, and also most other team workers have not used CMC in unreal way. For example, intentionally override PhysWalking and do not call its super, change the velocity and movmentmode whenever they want.
     - For engine part: I removed most of the changes as they are designed for another project(Wuthering Waves).
     - For project part: I refactored child function implementations. Things considered here are mostly like what is the right place a piece of out logic should be put. If it is the only selection, a child implemented function will be insert to the engine code.  
 - KawaiiPhysics：
   - Deep dive into the code implementation and did some configurations. Knowing about the capability bound of KawaiiPhysics.
   - Provided a fairly details document to my team. Explanation for each params and video demos.
   - Also, I provided a gismo for our artists. A way to save PhysicsSettings to template, for later initializing new KawaiiPhysics node.

### **Strinova** `2020.4 - 2024.11`
- Participated in the refacor of our ability system(two times), and weapon system:
  - The first time is focusing on the part of developing role skills with GAS case by case, and highly relies on the ability class hierachy we implemented.
  - The second time my leader come out a new idea by factoring all the functions we need into components and extended ability configurations(function classes), along with gameplaytagged event systems and global delegate system for triggering. This time, I worked as an assistant to help him migrate all this existing skills to this new system. As a whole, He wrote the primary code of the framework, I developed old skills in this new way and kept improving the system.
  - Work of the weapon system is similar to the development of skill system. But this time, at the very start, I parcitipated in only part of the system cause it is too complex. Character state machine, weapon state machine, gun designs, skills, animations, cameras, rpcs & replications. It took me about a year to fully understand all these stuffs.
- A framework that helps manager the playing and stoping of all actors game effects: Particle effects, materials, audios, screen UI, team occlusion and decals.
  - The whole system is divided in to severel subsystems along with an actor component to work with them.
  - The first goal of this system is to seperate character logics from effect assets, so that we can change any of the effects if our character has a different skin. I heavily used gameplaytag to label all the character actions or events and states. Each tag can be mapped into an asset table, which contains all infos needed for playing this kind of asset. Changing asset tables is the only thing needed to change character effects.
  - The second goal is to simplify the way of managering character effects for developers. No more need for them to care about which assets they are playing. Whether it's a particle, or an audio, or something else. Also, there is no need for them to cache all the infomations needed to stop them. All theses stuffs are handled by my component and systems. The only thing they have to do is firing their gameplaytag to start or end along with some controlling messages. 
  - What is more, I inherited gameplay skill cue to fully integrated to this framework. So that gameplay skill effect can easily manage its instigator effects in this way.
- General hold/switch input system for character actions: Actions like firing, aiming, ads, flying in paper state, sideways in paper state can be triggered or cannelled by toggling or holding/release keys. If their key is holded, they can by interrupted by other actions temporarily, but will automatically recovered later on.
  - Heavility relies on the usage of gameplay tag and GAS gameplaye events and game abilities.
  - The whole system is divided into two parts.
    - Raw input: Keeps tracking the anticipated actions of our player, specifically the keyboard input orders and input types(switch type, hold type, weak hold type, etc.). In this part we trigger or cancel skills to toggle character actions.
    - Skills: Character actions are directly controlled by skills. This is where they are finally triggered, interrupted and recoverred.
- Configuration based gameplay rules developing:
  - All gameplay rules are controlled by well-designed components for game mode, game state, player controller, player state.
  - Similar to MVC model. Data and controlling are seperated from each other. 
  - The keypoint of this system is to design reasonable minimized controllers. They should be easy to reuse and flexible to be composed with each other.
- Responsible for character, weapon, minion animation developing(start from 2024):
  - ALS based character animation system. This is first implemented by my leader, and improved by me and my other colleague later on. Start from 2024, I was the only one responsible for this whole system.
  - Designed the way of building meleee attacking system including weapons and animations. Support different kind of attacking Weapons like Katana and tails(logically weapon).
  - New way of managing montage slot anim graph logic. A layer before blendlayer to handle montages instead of slot for each indivisual part during overlay blending. ALS way of handling montages has no space for stance differences.
  - Also, I have made a lot of effects to achieve smooth animation transitions, frame skipped motion specially. 
  - Animation system for weapons and minions. Much simpler than characters, less states, less animation asssets, no IK needed, no split for upperbody and lowerbody . 

<!-- ### Footer

Last updated: Nov 2018 -->
