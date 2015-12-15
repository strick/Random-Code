/* While in sport mode do this once per second */
/* Set total time to the following fartlek
 * 10' warmup
 * 6' fast / 3' slow
 * 5' fast / 2.5' slow
 * 4' fast / 2' slow
 * 3' fast / 1.5' slow
 * 2' fast / 1' slow
 * 1' fast
 * 5' cool down
 */
/* 10' warmup */
WARMUP = 600;
/* Start fartlek at 6' */
STARTINTERVAL = 360;
/* 5' cooldown */
COOLDOWN = 300;

/* Just starting, set result to full time. */
if(SUUNTO_DURATION == 0 && TOTALTIME == 0) {
    
	/* Add appropriate interval times and cool downs to the total time */
	while(STARTINTERVAL > 0){
  
      /* If it's the last interval, 1', then no cool down */
      if(STARTINTERVAL == 60) {
        TOTALTIME = TOTALTIME + STARTINTERVAL;
      }
      else {
      	/* Total time is going to be the current interval time + cool down which is half the time */
      	TOTALTIME =  TOTALTIME + STARTINTERVAL + (STARTINTERVAL / 2);
      }
      
      /* Next inteval is a minute less */
      STARTINTERVAL = STARTINTERVAL - 60;
    }

	/* Add warmup and cooldown to total time */
	TOTALTIME = TOTALTIME + WARMUP + COOLDOWN;
  
	RESULT = TOTALTIME; 
  
    TOTALNOCHANGE = TOTALTIME;
}
/* Every other time, remove a second. */
else if(SUUNTO_DURATION > 0) {
	TOTALTIME = TOTALTIME - 1;
	RESULT = TOTALTIME;
}

/* Reset the interval */
STARTINTERVAL = 360;
EXPIREDINTERVAL = 0;

/* If warmup is over 2160s */
if(SUUNTO_DURATION == (TOTALNOCHANGE - WARMUP)) {
	Suunto.light();
  	Suunto.alarmBeep();
  	Suunto.alarmBeep();
  	Suunto.alarmBeep();  		
}

/* Check for interval beep */
while(STARTINTERVAL > 0){
    
  /* Interval beep, the first was is cooldown */
  /* 2760 - 600 - 360 - 180  (total - warmup - (previous fast/cool) - 6min fast) */
  if(SUUNTO_DURATION == (TOTALNOCHANGE - (WARMUP + EXPIREDINTERVAL + STARTINTERVAL))){
    Suunto.light();
  	Suunto.alarmBeep();
    Suunto.alarmBeep();
    Suunto.alarmBeep();
  }
  /* Cool down beep */
  /* 2760 - 600 - 360 - 180  (total - warmup - (previous fast/cool) - 4min fast - 2min cool) */
  else if(SUUNTO_DURATION == (TOTALNOCHANGE - (WARMUP + EXPIREDINTERVAL + STARTINTERVAL + (STARTINTERVAL / 2)))){
    Suunto.light();
    Suunto.alarmBeep();
    Suunto.alarmBeep();
    Suunto.alarmBeep();
  }
  
  /* Keep tabs on how much time is used on previous intervals / cool downs */
  EXPIREDINTERVAL = EXPIREDINTERVAL + STARTINTERVAL + (STARTINTERVAL / 2);
  
  /* Check for each 1' interval */
  STARTINTERVAL = STARTINTERVAL - 60;  
}
