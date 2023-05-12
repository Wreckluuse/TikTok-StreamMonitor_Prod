<script>
    export let chatLayout;
    export let evtLayout;
    
   export let settingsPositions = [];
   
   let shiftTab = (direction) => {
    if (direction = 'left') {
        
    }
   }   
</script>

<div class="right-[20px] bottom-[90px] w-fit pl-4 pr-4 h-[200px] fixed">
    {#if [settingsPositions[0] == "chat"]}
    <div class="w-full  rounded-t-lg h-fit pb-2 bg-secondary text-center"><button on:click={shiftTab('left')} class="ml-1 mt-1 float-left w-[100%] h-[100%] rounded-md bg-primary w-fit pl-1 pr-1"><i class="fa-solid fa-arrow-left text-secondary-content"></i></button> <h1 class="w-fit inline ml-auto mr-auto">Chat Settings</h1> <button on:click={shiftTab('right')} class="float-right rounded-md bg-primary w-fit inline  pl-1 pr-1 mr-1 mt-1"><i class="fa-solid fa-arrow-right text-secondary-content"></i></button></div>
    <div class="h-[90%] w-[95%] mt-5 grid grid-cols-2 justify-items-center">
        <span>
            <h3 class="mt-1 ">Width </h3>
            <input
                bind:value={chatLayout.w}
                class="mt-1 w-[30%] text-center rounded-sm pl-1 pr-1"
                name="chatW"
                type="number"
                min="3"
                max="13"
            />
        </span>
        <span>
            <h3 class="mt-1 ">Height </h3>
            <input
                bind:value={chatLayout.h}
                class="mt-1 w-[30%] text-center rounded-sm pl-1 pr-1"
                name="chatH"
                type="number"
                min="2"
                max="6"
            />
        </span>
        <span>
            <h3 class="mt-1">X Coordinate</h3>
            <input
                bind:value={chatLayout.x}
                class="mt-1 w-[30%] text-center rounded-sm pl-1 pr-1"
                name="chatX"
                type="number"
                min="1"
                max="7"
            />
        </span>
        <span>
            <h3 class="mt-1">Y Coordinate</h3>
            <input
                bind:value={chatLayout.y}
                class="mt-1 w-[30%] text-center rounded-sm pl-1 pr-1"
                name="chatY"
                type="number"
                min="1"
                max="3"
            />
        </span>
    </div>
    {:else if settingsPositions[0] == "evt"}
    <div class="w-[90%] ml-auto mr-auto rounded-t-lg h-fit pt-2 pb-2 bg-secondary text-center"><button on:click={shiftTab('left')} class="float-left rounded-md ml-1 bg-primary w-fit h-fit p-2"></button><h2 class="text-center"> Event Settings</h2> <button on:click={shiftTab('right')} class="float-right rounded-md bg-primary w-fit mr-1 h-fit p-2"></button></div>
    <div class="h-[90%] w-[95%] mt-2 grid grid-cols-2">
        <span class="w-[100%] h-[100%]">
            <label class="mt-1 " for="evtW">Width: </label>
            <input
                bind:value={evtLayout.w}
                class="mt-1  text-center rounded-xl pl-2 pr-2 w-fit h-fit"
                name="chatW"
                type="number"
                min="3"
                max="13"
            />
        </span>
        <span class="w-[100%] h-[100%]">
            <label class="mt-1 " for="evtH">Height: </label>
            <input
                bind:value={evtLayout.h}
                class="mt-1  text-center rounded-xl pl-2 pr-2 w-fit h-fit"
                name="evtH"
                type="number"
                min="2"
                max="6"
            />
        </span>
        <br>
        <span class="w-[100%] h-[100%]">
            <label class="mt-1 " for="evtX">X: </label>
            <input
                bind:value={evtLayout.x}
                class="mt-1 text-center rounded-xl pl-2 pr-2 w-fit h-fit"
                name="evtX"
                type="number"
                min="1"
                max="7"
            />
        </span>
        <span class="w-[100%] h-[100%]">
            <label class="mt-1 " for="evtY">Y:</label>
            <input
                bind:value={evtLayout.y}
                class="mt-1  text-center rounded-xl pl-2 pr-2 w-fit h-fit"
                name="chatY"
                type="number"
                min="1"
                max="3"
            />
        </span>
    </div>
    {/if}
</div>
