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
  
### **HuaZhong Agoricultureal University(211) ** `2012.9 - 2016.6 @Wuhan，China`
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
- UE4 RawInput: familiar with the progress from winpumpmessage to playerinput and PlayerController TickPlayerInput.
- CameraManager: familiar with UpdateCamera and viewtarget management.
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
 - Animation system refactoring: mainly for logical decoupling and standarizing the way of code implememtation. This is to make our system stable and extentable.
   - Refactor the management of game animation state. Including parent-child states choosing and switching, state related gameplaytag managing, animation state collaborating with skills and movements.
   - Game state driven locomotion animations(ground, jump, falling etc.) for different character actions. For example, adding special designed animations for a dash skill transferring to land or fall.
 - Animation and movements:
   - Spling running: customized movement mode, driven by spline data. Works well for high speed moving.
   - Wall moving: limited requirements for world collisions
     - Dynamic changed player inputs to world acceleration coordinates which takes wall info, camera direction and movement info into account.
     - Allows character to move upside down, and smoothly moving along rough wall or moving across walls with sharp angle.
     - Extra work for interpolating from mesh to rootcomponent.
     - Collision adjustment in narrow space. Characters will never get stuck.
 - Characterized jump actions: wall move jump, ground edge auto jump, wall edge auto jump. 
   - Different jumps for each action and camera angle.
   - Predicted jump location on ground edge jump as walking mode has a tollerance to move out of edge.
   - Animation curve based jump movement control including speed control, gravity control.
 - Refined Walk/Run/Sprint: stride, playrate, IK & VB. 
   - Smooth transitions between walk-run-sprint and paired blend out skill montage transition animations.
   - HandIK with virtual bone locks assistant hand to counter local space blend and additive.
 - Modular character with one single animation instance: for chaging character skinned parts with part animations.
   - Working as an indivisual plugin, functionalized as a combination of two actor components. It can be used for any actors.
   - Character mesh is composed of several part meshes. Part mesh varies from the part skin player choosen. Two ways provided to compose these meshes:
     - One way is using MergeMesh to merge all selected meshes into one and output all animation bones result to this. This asks for only one skeletalmesh component, but requires extra works for physics assets and morph targets.
     - The other way is using LeaderPoseComponent, multiple part skeletalmesh components and a nude model as leader component. Output all animation bones result to nude model.
     - Both ways ask for a shared skeleton for all participated meshed. And the most important, bind pose of part meshes should never change the bones location of main bodies.
   - Only one animation instance is needed for either of the two ways above. One set of main body animations for all part combinations, including all the walk, run, jump animations and skill animations. Each part mesh should have their own animation set driving themselves only。
   - Also, I slightly modified a bit of the engine code. Animation graph shuold only concentrate on the logic of main body animations, as part animations are automated paired by main body animation names. Part animation bone transforms will be sampled right at the time main body animation sampled, and only the bones part animations tracked will be merged.
   - As for configurations, a structured directory hierachy is needed for this system. The hirerachy specifies each part by ids and their available skins by skin ids. Under the directory of each part skins, several kind of data assets we provided for configuring meshes, animations, effects, audios should be placed. The time a list of parts are asked with their ids and skin ids. These data will be automaticly loaded and maintained by my components.
   - Apart from the asset configurations. I also added a special type of functional data asset called Chooser data asset. The mesh of a part can vary from the other part it connects, we use chooser data asset to config functions(customized class CDO) to choose the right mesh we wanted for different mesh combinations.
 - UE4.27 upgraded to UE5.5.4：animation and movement。
   - There is not much work about animations. The most important thing I need to do is figuring out all the engine code we have modified for the part of animation, and make a decision of what we should keep.
   - Things are more complicated when it goes to movment. This is mainly because we have changed the engine code a lot, and also most other team workers have not used CMC in unreal way. For example, intentionally override PhysWalking and do not call its super, change the velocity and movmentmode whenever they want.
     - For engine part: I removed most of the changes as they are designed for another project(Wuthering Waves).
     - For project part: I refactored child function implementations. Things considered here are mostly like what is the right place a piece of out logic should be put. If it is the only selection, a child implemented function will be insert to the engine code.  
 - KawaiiPhysics：
   - Deep dive into the code implementation and did some configurations. Knowing about the capability bound of KawaiiPhysics.
   - Provided a fairly details document to my team. Explanation for each params and video demos.
   - Also, I provided a gismo for our artists. A way to save PhysicsSettings to template, for later initializing new KawaiiPhysics node.

### **Strinova** `2020.4 - 2024.11`
- 项目早期参与了卡拉彼丘早期技能系统的两次重构，一次武器系统的重构：
  - 早期部分角色的技能开发。
  - 对武器的实现细节十分熟悉。尤其是对动画、相机的支持和复杂的武器状态管理上面。
- 制定并且统一了卡拉彼丘局内所有玩法效果的管理方案： 涉及特效，材质，音效，UI，透视，团队色，贴花。
  - 通过组件和对应的SubSystem提供不同层面的控制。
  - 游戏逻辑和资源解耦，以及统一的资源配置方式，蓝图数据只用关心逻辑，逻辑开发时只用关心流程操控。不需要每次都额外关心资源的获取和配置。
  - 支持不同皮肤的效果变化。
  - 自我的生命周期管理，不依赖模型和材质的加载时机。
  - 支持GC对玩法效果的控制。
- 角色的重生系统：
  - 重生不销毁角色以及需要继续使用的所有actor。减少网络开销。数据初始流程组件化。
  - 细分重生阶段，每个阶段支持功能原子化配置化。通过配置不同的操控类可以动态修改重生流程（修改出生点、属性、技能、武器等）。
  - 支持可选的分帧重生。严格管理RestartPlayer的调用，统一复活时机的管理。
- 长按切换操作的管理系统：侧身、飘飞、开火、肩射开镜等操作需要根据当前的角色状态、武器状态、技能状态等进行合理的恢复和打断。
  - 一套底层代码，同时支持PC和MB的不同操作行为。
  - 支持同个操作同时具备多个按键、多个切换模式。
  - 同时涉及到角色，武器，技能，按键控制。极其复杂的事件处理和规划。
  - 具备动态调整的灵活性，不会因为经常性小范围的调整导致整个底层代码的不兼容。
- 玩法模式的配置化：
  - 玩法重要部件完全放弃继承。仅使用最基础的父类。功能90%以上由组件和功能类组合的方式实现。
  - 事件监听组件：监听事件的发生，或者标签的添加和移除。执行对应的功能类。
  - 状态组件：简化的同步状态机。状态变化执行对应的功能类。
  - 等级经验组件、计时组件。类似UE5的GameEvent系统，大量使用GameplayTag对控制和具体的逻辑进行解耦。
  - 使用同步数据和TimeStamp保证关键流程的一致性。
- 负责项目局内的角色动画：
  - 对项目的角色、武器、召唤物的的动画设计和动画计算以及一些优化比较清楚。
  - 对动画在Gameplay框架下的处理方式非常清楚。
  - 对相机的更新流程，数据处理比较清楚。
  - 清楚动画的计算流程，大部分AnimNode的实现细节。

<!-- ### Footer

Last updated: Nov 2018 -->
