export namespace main {
	
	export class Medication {
	    name: string;
	    amount: number;
	    unit: string;
	    dosage: number;
	    stock: number;
	    last_updated: string;
	
	    static createFrom(source: any = {}) {
	        return new Medication(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.amount = source["amount"];
	        this.unit = source["unit"];
	        this.dosage = source["dosage"];
	        this.stock = source["stock"];
	        this.last_updated = source["last_updated"];
	    }
	}

}

