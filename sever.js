const express = require("express");
const {sequelize} = require("./models");
const {rootRouter} = require("./routers")
const moment = require('moment');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const path = require("path");
const port = 3007;
const app = express();
const cors = require("cors");
const cron = require('cron');
app.use(cookieParser());
app.use(cors());
//cài ứng dụng sử dụng json
app.use(express.json());
//cài static file
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  express.urlencoded({
    extended: true,
  }),
);

//dùng router
app.use(rootRouter);
const {Invoice, Cart } = require("./models");
const { QueryTypes, Op, where, STRING } = require("sequelize");

const job = new cron.CronJob('0 */30 * * * *', async () => {
  // Mã thực hiện xoá các invoice không được thanh toán trong 1 ngày
  await deleteUnpaidInvoices();
});

// const job = new cron.CronJob('*/10 * * * * *', async () => {
//   // Mã thực hiện xoá các invoice không được thanh toán trong 1 ngày
//   await deleteUnpaidInvoices();
// });
// Hàm thực hiện xoá các invoice không được thanh toán trong 1 ngày
async function deleteUnpaidInvoices() {
    let invoices = await Invoice.findAll({
        where: {
          status: 0,
          date: {
            [Op.lt]: moment().subtract(30, 'minutes')
          }
        },
        raw: true
      })
      for (const invoice of invoices) {
        let cart = await Cart.findOne({
          where:{idCart: invoice.idCart},
        })
        cart.isCurrent = 1
        await cart.save()
        await invoice.destroy();
        
      }
}

// Bắt đầu công việc cron
job.start();

//lắng nghe sự kiện kết nối
app.listen(port, async () => {
    console.log(`App listening on http://localhost:${port}`);
    try {
        await sequelize.authenticate();
        console.log('Kết nối thành công!.');
      } catch (error) {
        console.error('Kết nối thất bại:', error);
      }
})