<script lang=ts>
    export let badgeType: string = "light";
    export let title: string = "Title" ;
    export let subTitleType: string = "string";
    export let value: any = 0;
    export let subTitle: string = "Sub Title";
    export let icon: string = "light";
    export let link: string = "";
    let primaryColor:string;
    let primaryTextColor:string;
    let secondaryTextColor:string = "";
    let iconColor:string = "";
    let iconBg:string = "";
    let btnColor:string = "";
    const options :Intl.DateTimeFormatOptions = { timeZone: 'Europe/Paris', hour12: false, hour: '2-digit', minute: '2-digit' };

    

    if (badgeType == "light"){ 
        primaryColor = "from-slate-300 to-slate-400 opacity-80 ";
        primaryTextColor = "text-black";
        secondaryTextColor = "text-slate-800";
        iconBg = "bg-white";
        btnColor = "bg-white"
        
        
    }else{
        primaryColor = "from-blue-900 to-slate-900 opacity-80";
        primaryTextColor = "text-white";
        secondaryTextColor = "text-slate-400";
        iconColor = "invert";
        iconBg = "bg-gray-500";
        btnColor = "bg-yellow-300";
        
    }

    let valueToShow = value;

    function getValue(){
        if (icon=="clock"){
            return value.toLocaleTimeString('en-US', options)
        }else{
            return  value
        }
        
    }

    $:{value ; valueToShow = getValue();}


    
    

</script>

<div class="bg-gradient-to-r {primaryColor} rounded-3xl p-5 grid grid-cols-1">
    
    <div class="h-fit flex  items-center">
        <div class="{iconBg} rounded-full {iconColor} ">
            <img class="w-7 m-2" src="{icon}.svg" alt="{icon}">
        </div>
    </div>
    <div class="h-fit flex  items-center">
        <h2 class="{primaryTextColor} text-2xl  font-sans">{title}</h2>
    </div>

    <div class="flex  items-center">
        {#if (subTitleType == "string")}

        <p class="{secondaryTextColor}    font-sans">{subTitle}</p>
            
        {:else if (subTitleType != "string")}
            
        <p class="{secondaryTextColor}  font-sans">{valueToShow}</p>

        {/if}
    </div>

    <div class="flex justify-center items-center">
        <a href="{link}">
        <div class="{btnColor} rounded-full align-middle  p-2 px-7 py-3"><img class="h-4" src="arrow.svg" alt="arrow"></div></a>
    </div>
</div>