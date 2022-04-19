import { objData } from "./data.js";
import { createNewEl, log } from "./utlites.js";

const changeSection = document.getElementById("VarietiesOfApples");

const madeEl = () => {
  const time = Date.now();
  let elData = "";
  objData.forEach((el) => {
    elData += `<tr>
<td  >${el.img}</td>
<td>${el.text}</td>
</tr>`;
  });
  const pushTableEl = `
<table  class="table_varieties">
<tbody>
${elData}
</tbody>
</table>`;

  changeSection.append(createNewEl(pushTableEl));
  log(Date.now() - time);
};
madeEl();
