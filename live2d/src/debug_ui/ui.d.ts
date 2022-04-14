// Type definitions for ./ui.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace webglLessonsUI{
	// webglLessonsUI.setupUI.!ret
	
	/**
	 * 
	 */
	interface SetupUIRet {
	}
}
declare namespace webglLessonsUI{
	// webglLessonsUI.setupSlider.!1
	
	/**
	 * 
	 */
	interface SetupSlider1 {
	}
}
declare namespace webglLessonsUI{
	// webglLessonsUI.setupSlider.!ret
	
	/**
	 * 
	 */
	interface SetupSliderRet {
		
		/**
		 * 
		 */
		elem : {
						
			/**
			 * 
			 */
			innerHTML : string;
		}
				
		/**
		 * 
		 * @param v 
		 */
		updateValue(v : number): void;
	}
}
declare namespace webglLessonsUI{
	// webglLessonsUI.makeSlider.!0
	
	/**
	 * 
	 */
	interface MakeSlider0 {
				
		/**
		 * 
		 */
		value : number;
				
		/**
		 * 
		 * @param event 
		 * @param uiInfo 
		 */
		slide(event : any, uiInfo : webglLessonsUI.MakeSlider0.Slide1): void;
	}
}
declare namespace webglLessonsUI.MakeSlider0{
	// webglLessonsUI.makeSlider.!0.slide.!1
	
	/**
	 * 
	 */
	interface Slide1 {
				
		/**
		 * 
		 */
		value : number;
	}
}
declare namespace webglLessonsUI{
	// webglLessonsUI.makeCheckbox.!0
	
	/**
	 * 
	 */
	interface MakeCheckbox0 {
				
		/**
		 * 
		 * @param event 
		 * @param uiInfo 
		 */
		change(event : any, uiInfo : webglLessonsUI.MakeCheckbox0.Change1): void;
	}
}
declare namespace webglLessonsUI.MakeCheckbox0{
	// webglLessonsUI.makeCheckbox.!0.change.!1
	
	/**
	 * 
	 */
	interface Change1 {
	}
}
declare namespace webglLessonsUI{
	// webglLessonsUI.makeCheckbox.!ret
	
	/**
	 * 
	 */
	interface MakeCheckboxRet {
		
		/**
		 * 
		 */
		elem : {
						
			/**
			 * 
			 */
			className : string;
		}
				
		/**
		 * 
		 * @param v 
		 */
		updateValue(v : any): void;
	}
}

/**
 * Browser globals
 */
declare namespace webglLessonsUI{
		
	/**
	 * 
	 * @param parent 
	 * @param object 
	 * @param uiInfos 
	 * @return  
	 */
	function setupUI(parent : any, object : any, uiInfos : any): webglLessonsUI.SetupUIRet;
		
	/**
	 * 
	 * @param widgets 
	 * @param data 
	 */
	function updateUI(widgets : any, data : any): void;
		
	/**
	 * 
	 * @param selector 
	 * @param options 
	 * @return  
	 */
	function setupSlider(selector : any, options : webglLessonsUI.SetupSlider1): webglLessonsUI.SetupSliderRet;
		
	/**
	 * 
	 * @param options 
	 * @return  
	 */
	function makeSlider(options : webglLessonsUI.MakeSlider0): /* webglLessonsUI.setupSlider.!ret */ any;
		
	/**
	 * 
	 * @param options 
	 * @return  
	 */
	function makeCheckbox(options : webglLessonsUI.MakeCheckbox0): webglLessonsUI.MakeCheckboxRet;
}
