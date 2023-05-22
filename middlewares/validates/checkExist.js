

const checkExistAccount = (Model) => {
  return async (req, res, next) => {
    try {
      const { phone } = req.body;
      console.log('check')
      const account = await Model.findOne({
        where: {
          phone,
        },
      });
      if (account) {
        console.log('check1')
        next();
      } else {
        res.status(404).send({ message: "Không tìm thấy tài khoản!", isSuccess: false, isExist: false, status: true });
      }
    } catch (error) {
      res.status(500).send({ message: "Không tìm thấy tài khoản!", isSuccess: false, isExist: false, status: true });
    }
  }

};



module.exports = {

  checkExistAccount
};
