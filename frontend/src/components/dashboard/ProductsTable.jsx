import { useState, useEffect } from 'react';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast.mjs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProductForm = ({ product, onSubmit, categories }) => {
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    category_id: '',
  });
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || '',
        description: product.description || '',
        price: product.price || '',
        category_id: product.category_id || '',
      });
      if (product.urlPhoto) {
        setImagePreview(product.urlPhoto);
      }
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category_id: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.productName || !formData.description || !formData.price || !formData.category_id) {
      toast({
        title: "Campos Requeridos",
        description: "Debes introducir todos los campos para continuar",
        variant: "destructive",
      });
      return;
    }

    const submitFormData = new FormData();


    submitFormData.append('productName', formData.productName.trim());
    submitFormData.append('description', formData.description.trim());
    submitFormData.append('price', formData.price);
    submitFormData.append('category_id', formData.category_id);

    if (file.type !== 'image/webp' && file.type !== 'image/png') {
      toast({
        title: "Error",
        description: "Solo se permiten imagenes en formato .webp o .png",
        variant: "destructive",
      });
      return;
    }

    if (file) {
      submitFormData.append('photo', file);
    }

    console.log('Sending FormData for update:');
    for (let pair of submitFormData.entries()) {
      console.log(pair[0], '=', pair[1]);
    }

    onSubmit(submitFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="productName">Nombre Producto</Label>
        <Input
          id="productName"
          name="productName"
          value={formData.productName}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Info Producto</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="price">Precio</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select
          value={formData.category_id}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Usa una categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.categoryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="urlPhoto">Imagen de Producto</Label>
        <Input
          id="urlPhoto"
          name="urlPhoto"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1"
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full h-auto max-h-48 object-contain"
            />
          </div>
        )}
      </div>

      <Button type="submit" className="w-full">
        {product ? 'Actualizar Producto' : 'Crear Producto'}
      </Button>
    </form>
  );
};

export default function ProductsTable() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL;

  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products/category`, { headers });
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      console.log("Productswithcategory", data.data)
      setProducts(data.data)
    } catch (error) {
      toast({
        title: "Opps! Tenemos un Problema!",
        description: "No se pudo cargar los productos",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`, { headers });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      toast({
        title: "Opps! Tenemos un Problema!",
        description: "No se pudo cargar las categorias",
        variant: "destructive",
      });
    }
  };

  const fetchProductDetails = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, { headers });
      if (!response.ok) throw new Error('Failed to fetch product details');
      const data = await response.json();
      console.log("ProductDetails", data.data)
      setSelectedProduct(data.data);
      setIsViewOpen(true);
    } catch (error) {
      toast({
        title: "Opps! Tenemos un Problema!",
        description: "No se pudo cargar los detalles del producto",
        variant: "destructive",
      });
    }
  };

  const createProduct = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          Authorization: headers.Authorization,
        },
        body: formData,
      });
      if (formData.p) { }
      if (!response.ok) throw new Error('Failed to create product');
      toast({
        title: "Hecho!",
        description: "Producto creado con exito!",
      });
      fetchProducts();
      setIsCreateOpen(false);
    } catch (error) {
      toast({
        title: "Opps! Tenemos un Problema!",
        description: "No se pudo crear el producto",
        variant: "destructive",
      });
    }
  };

  const updateProduct = async (id, formData) => {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: headers.Authorization,
        },
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to update product');
      toast({
        title: "Hecho!",
        description: "Producto actualizado con exito!",
      });
      fetchProducts();
      setIsEditOpen(false);
    } catch (error) {
      toast({
        title: "Opps! Tenemos un Problema!",
        description: "No se pudo actualizar el producto",
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Estas seguro de eliminar este producto?')) return;

    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (!response.ok) throw new Error('Failed to delete product');
      toast({
        title: "Hecho",
        description: "Producto eliminado con exito!",
      });
      fetchProducts();
    } catch (error) {
      toast({
        title: "Opps! Tenemos un Problema!",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Productos</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Anadir Producto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Producto</DialogTitle>
            </DialogHeader>
            <ProductForm
              categories={categories}
              onSubmit={createProduct}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre Producto</TableHead>
              <TableHead>Info Producto</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.category.categoryName || 'Sin categoría'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => fetchProductDetails(product.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsEditOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={selectedProduct}
            categories={categories}
            onSubmit={(formData) => updateProduct(selectedProduct.id, formData)}
          />
        </DialogContent>
      </Dialog>


      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Producto</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div>
                <Label>Nombre Producto</Label>
                <p>{selectedProduct.productName}</p>
              </div>
              <div>
                <Label>Info Producto</Label>
                <p>{selectedProduct.description}</p>
              </div>
              <div>
                <Label>Precio</Label>
                <p>${selectedProduct.price}</p>
              </div>
              <div>
                <Label>Categoria</Label>
                <p>{
                  categories.find((c) => c.id === selectedProduct.category.id)
                    ?.categoryName || "Sin categoría"}</p>
              </div>
              <div>
                <Label>Imagen del Producto</Label>
                {selectedProduct.urlPhoto && (
                  <img
                    src={selectedProduct.urlPhoto}
                    alt={selectedProduct.productName}
                    className="mt-2 max-w-full h-auto max-h-48 object-contain"
                  />
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>);
}
