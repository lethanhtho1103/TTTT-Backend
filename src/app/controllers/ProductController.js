const multer = require("multer");
const storage = require("../../services/uploadImage");
const ProductDetail = require("../models/ProductDetail");
const Product = require("../models/Product");
const Category = require("../models/Category");

class ProductController {
  async createProduct(req, res, next) {
    const upload = multer({ storage: storage }).single("image");
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });  
      } else {
        try {
          const name = req.body.name;
          const description = req.body.description;
          const price = parseInt(req.body.price, 10);
          const quantity = parseInt(req.body.quantity, 10);
          const category_id = req.body.category_id;
          const image = req.file.originalname;
          const specifications = req.body.specifications || null;
         
          if (category_id) {
            const categoryExists = await Category.findById(category_id);
            if (!categoryExists) {
              return res.status(400).json({ message: "Invalid category_id" });
            }
          }
          const existingProduct = await Product.findOne({ name });
          if (existingProduct) {
            existingProduct.quantity += quantity;
            await existingProduct.save();
            return res.json({
              message: "Product updated successfully",
              data: existingProduct,
            });
          }
            // const newProduct = new Product({
            //   name,
            //   description,
            //   price,
            //   quantity,
            //   category_id,
            //   image,
            //   specifications,
            const productDetail = new ProductDetail ({
              cpu_type: req.body.cpu_type || null,
              ram: req.body.ram || null,
              storage_capacity: req.body.storage_capacity || null,
              screen_size: req.body.screen_size || null,
              graphics: req.body.graphics || null,
              connectivity: req.body.connectivity || null,
              mouse_keyboard: req.body.mouse_keyboard || null,
              size: req.body.size || null,
              weight: req.body.weight || null,
              color: req.body.color || null,
              warranty: req.body.warranty || null,
              other_features: req.body.other_features || null,
              manufacturer: req.body.manufacturer || null,
              model: req.body.model || null,
              screenType: req.body.screenType || null,
              brightness: req.body.brightness || null,
              contrastRatio: req.body.contrastRatio || null,
              screenSize: req.body.screenSize ||null,
              panelType: req.body.panelType || null,
              viewingAngle: req.body.viewingAngle || null,
              responseTime: req.body.responseTime || null,
              aspectRatio: req.body.aspectRatio || null,
              refreshRate: req.body.refreshRate || null,
              recommendedResolution: req.body.recommendedResolution || null,
              review: req.body.review || null,
              mainboard: req.body.mainboard || null,
              radiators: req.body.radiators || null,
              hardDrive: req.body.hardDrive || null,
              card: req.body.card || null,
              caseTower: req.body.caseTower ||  null,
              psu: req.body.psu || null,
              material: req.body.material || null,
              high: req.body.high || null,
              mouseType: req.body.mouseType || null,
              untilities: req.body.untilies || null,
              ergonomics: req.body.ergonomics || null,
              requestSystem: req.body.requestSystem || null,
              guarantee: req.body.guarantee || null,
              keyboardType: req.body.keyboardType || null,
              hearType: req.body.hearType || null,
              //   // trường chitiet laptop 
              // cpu_type, // loai cpu
              // ram,  // RAM
              // storage_capacity, //lưu trữ
              // screen_size, //kích thước màn hình
              // graphics, //đồ họa
              
              // // cả 2
              // connectivity, //kết nối

              // mouse_keyboard, 
              // size,//kích thước
              // weight,//trọng lượng
              // color,//màu sắc
              // warranty, //bảo hành
              // other_features,//các tính năng khác

              // // chi tiết của màng hình
              
              // manufacturer, //hãng sản xuất
              // model, // mã sản phẩm
              // screenType, //loại màn hình
              // brightness,//độ sáng
              // contrastRatio,//độ tương phản
              // screenSize,//kích thước màn hình
              // panelType,//tấm nén
              // viewingAngle,//
              // responseTime,//thời gian phản hồi
              // aspectRatio,//tỷ lệ màn hình
              // refreshRate,//tần số quét
              // recommendedResolution,// độ phân giải
             

              // review,//bài viết đánh giá

              // //PC
              // mainboard,
              // radiators,
              // hardDrive,
              // card,
              // caseTower,
              // psu,

              // //Ghế
              // material,
              // high,

              // //Chuột
              // mouseType,
              // untilities, // tiên ích
              // ergonomics, // công thái học
              // requestSystem,

              // //bàm phím
              // keyboardType,
              // guarantee,

              // //tai nghe
              // hearType,

            });  
            await productDetail.save();

            const newProduct = new Product({
              name,
              description,
              price,
              quantity,
              category_id,
              image,
              specifications,
              productDetail: productDetail_id, 
            });
            await newProduct.save();
            return res.status(200).json({
              message: `Category created successfully: ${name}.`,
              data: newProduct,
            });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
    });
  }

  async getAllProducts(req, res) {
    const searchQuery = req.query.name;
    if (searchQuery) {
      try {
        const products = await Product.find({
          name: { $regex: searchQuery, $options: "i" },
        }).populate("category_id"); // Populate thông tin của nhà xuất bản
        if (products.length > 0) {
          res.json(products);
        } else {
          res.json({ message: "Not found product" });
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    } else {
      try {
        const products = await Product.find().populate("category_id"); // Populate thông tin của nhà xuất bản
        res.json({ data: products });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  }

   async getProductsById(req, res) {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId).populate("category_id");

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ data: product });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateProduct(req, res, next) {
    const upload = multer({ storage: storage }).single("image");
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        try {
          const productId = req.params.id;
          const name = req.body.name;
          const description = req.body.description;
          const price = parseInt(req.body.price, 10);
          const quantity = parseInt(req.body.quantity, 10);
          const category_id = req.body.category_id;
          const image = req.file ? req.file.originalname : undefined;
          const specifications = req.body.specifications || null;
        
          // const cpu_type = req.body.cpu_type || null;
          // const ram = req.body.ram || null;
          // const storage_capacity = req.body.storage_capacity || null;
          // const screen_size = req.body.screen_size || null;
          // const graphics = req.body.graphics || null;
          // const connectivity = req.body.connectivity || null;
          // const mouse_keyboard = req.body.mouse_keyboard || null;
          // const size = req.body.size || null;
          // const weight = req.body.weight || null;
          // const color = req.body.color || null;
          // const warranty = req.body.warranty || null;
          // const other_features = req.body.other_features || null;
          // const manufacturer = req.body.manufacturer || null;
          // const model = req.body.model || null;
          // const screenType = req.body.screenType || null;
          // const brightness = req.body.brightness || null;
          // const contrastRatio = req.body.contrastRatio || null;
          // const screenSize = req.body.screenSize ||null;
          // const panelType = req.body.panelType || null;
          // const viewingAngle = req.body.viewingAngle || null;
          // const responseTime = req.body.responseTime || null;
          // const aspectRatio = req.body.aspectRatio || null;
          // const refreshRate = req.body.refreshRate || null;
          // const recommendedResolution = req.body.recommendedResolution || null;
          // const review = req.body.review || null;
          // const mainboard = req.body.mainboard || null;
          // const radiators = req.body.radiators || null;
          // const hardDrive = req.body.hardDrive || null;
          // const card = req.body.card || null;
          // const caseTower = req.body.caseTower ||  null;
          // const psu = req.body.psu || null;
          // const material = req.body.material || null;
          // const high = req.body.high || null;
          // const mouseType = req.body.mouseType || null;
          // const untilities = req.body.untilities;
          // const ergonomics = req.body.ergonomics || null;
          // const requestSystem = req.body.requestSystem || null;
          // const guarantee = req.body.guarantee || null;
          // const keyboardType = req.body.keyboardType || null;
          // const hearType = req.body.hearType || null;

          if (category_id) {
            const categoryExists = await Category.findById(category_id);
            if (!categoryExists) {
              return res.status(400).json({ message: "Invalid category_id" });
            }
          }
          const product = await Product.findById(productId);
          if (!product) {
            return res.status(404).json({ message: "Product not found" });
          }
          if (name) product.name = name;
          if (description) product.description = description;
          if (price) product.price = price;
          if (quantity) product.quantity = quantity;
          if (category_id) product.category_id = category_id;
          if (image) product.image = image;
          if (specifications) product.specifications = specifications;

          const productDetail = await ProductDetail.findById(product.productDetail);
          if (productDetail) {
            if (cpu_type) product.cpu_type = cpu_type;
            if (ram) productDetail.ram = ram;
            if (storage_capacity) productDetail.storage_capacity = storage_capacity;
            if (screen_size) productDetail.screen_size = screen_size;
            if (graphics) productDetail.graphics = graphics;
            if (connectivity) productDetail.connectivity = connectivity;
            if (mouse_keyboard) productDetail.mouse_keyboard = mouse_keyboard;
            if (size) productDetail.size = size;
            if (weight) productDetail.weight = weight;
            if (color) productDetail.color = color;
            if (warranty) productDetail.warranty = warranty;
            if (other_features) productDetail.other_features = other_features;

            if (manufacturer) productDetail.manufacturer = manufacturer;
            if (model) productDetail.models = model;
            if (screenType) productDetail.screenType = screenType;
            if (brightness) productDetail.brightness = brightness;
            if (contrastRatio) productDetail.contrastRatio = constrastRadio;
            if (screenSize) productDetail.screenSize = screenSize;
            if (panelType) productDetail.panelType = panelType;
            if (viewingAngle) productDetail.viewingAngle = viewingAngle;
            if (responseTime) productDetail.responseTime = responseTime;
            if (aspectRatio) productDetail.aspectRatio = aspectRatio;
            if (refreshRate) productDetail.refreshRate = refreshRate;
            if (recommendedResolution) productDetail.recommendedResolution = recommendedResolution;
            

            if (review) productDetail.review = review;

            if (mainboard) productDetail.mainbroad = mainboard;
            if (radiators) productDetail.radiators = radiators;
            if (hardDrive) productDetail.hardDrive = hardDrive;
            if (card) productDetail.card = card;
            if (caseTower) productDetail.caseTower = caseTower;
            if (psu) productDetail.psu = psu;

            if (material) productDetail.material = material;
            if (high) productDetail.high = material;

            if (mouseType) productDetail.mouseType = mouseType;
            if (untilities) productDetail.untilities = untilities;
            if (ergonomics) productDetail.ergonomics = ergonomics;
            if (requestSystem) productDetail.requestSystem = requestSystem;

            if (guarantee) productDetail.guarantee = guarantee;
            if (keyboardType) productDetail.keyboardType = keyboardType;

            if (hearType) productDetail.hearType = hearType;
            await productDetail.save();
          }
          await product.save();
          return res.status(200).json({
            message: `Product updated successfully: ${product.name}.`,
            data: product,
          });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
    });
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json({
        message: `Product deleted successfully: ${deletedProduct.name}.`,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ProductController();