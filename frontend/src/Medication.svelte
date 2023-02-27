<script lang="ts" context="module">
  export interface Medication  {
    name:         string;
    amount:       number;
    dosage:       number;
    stock:        number;
    last_updated: string;
    unit:         string;
  }

  /**
   * Returns the date when the medication stock will expire
   * @param med
   */
  export const expiryDate = (med: Medication) => {
    let date: Date = new Date();
    date.setDate(date.getDate() + daysLeft(med));
    return date.toDateString();
  }

  /**
   * Returns the stock for today
   * @param med
   */
  export const stockToday = (med: Medication) => {
    let days: number = Math.round((new Date().getTime() - new Date(med.last_updated).getTime()) / (1000 * 60 * 60 * 24));
    return med.stock - (days * med.dosage);
  }

  /**
   * Returns the number of days left until the stock expires
   * @param med
   */
  export const daysLeft = (med: Medication) => {
    if (med.dosage > 0) {
      let stock_today: number = stockToday(med);
      return Math.round(stock_today / med.dosage);
    } else {
      return 0;
    }
  }
  
</script>