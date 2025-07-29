import {
  Modal,
  Loader,
  Text,
  Alert,
  useMantineTheme,
  useMantineColorScheme,
  Box,
  Title,
  Group,
  TextInput,
  Textarea,
  Button,
  Stack
} from '@mantine/core';
import { IconSettings, IconX, IconHelp, IconBook } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import SidebarLayout from '../layout/SidebarLayout';
import { useState, useEffect } from 'react';
import UrlListPanel from '../category/UrlListPanel';
import { useQuery } from '@tanstack/react-query';
import { getOrCreateUserId } from '../../utils/getOrCreateUserId';
import { IconTrash } from '@tabler/icons-react';
import axiosInstance from '../../lib/axios';

function SettingsModal({ opened, onClose, categoryList, isLoading, error, refetchCategories }) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const navigate = useNavigate();

  // Handle modal close and dispatch settings changed event
  const handleClose = () => {
    // Dispatch settings changed event to notify other components
    const settingsChangeEvent = new CustomEvent('settingsChanged', {
      detail: {
        type: 'modalClosed',
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(settingsChangeEvent);
    onClose();
  };

  // Convert category names to category objects for SidebarLayout
  const categories = categoryList.map(categoryName => ({ categoryName }));
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  
  // Update selected category when categories change
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  // Listen for settings changes to refresh data
  useEffect(() => {
    const handleSettingsChange = (event) => {
      console.log('SettingsModal received settings change event:', event.detail);
      
      // If it's a data reset or import, refresh the category data
      if (event.detail.type === 'dataReset' || event.detail.type === 'dataImported') {
        console.log('Refreshing category data due to reset/import');
        refetchCategories();
      }
    };

    window.addEventListener('settingsChanged', handleSettingsChange);
    return () => window.removeEventListener('settingsChanged', handleSettingsChange);
  }, [refetchCategories]);

  const handleSelectCategory = (cat) => setSelectedCategory(cat);

  // Fetch URLs for selected category
  const userId = getOrCreateUserId();
  const { data: urlData, isLoading: urlLoading, error: urlError, refetch: refetchUrls } = useQuery({
    queryKey: ['urlList', userId, selectedCategory?.categoryName],
    queryFn: () => axiosInstance.get(`/setting/users/${encodeURIComponent(userId)}/categories/${encodeURIComponent(selectedCategory?.categoryName)}/urls`).then(res => res.data),
    enabled: !!selectedCategory?.categoryName,
  });

  // Combine category info with URL data
  const categoryWithUrls = selectedCategory ? {
    ...selectedCategory,
    url: urlData?.urls || []
  } : null;

  // Function to refetch both category list and current URL list
  const handleRefetchAll = async () => {
    await refetchCategories(); // Refetch category list
    await refetchUrls(); // Refetch current URL list
  };

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // Edit category state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryDesc, setEditCategoryDesc] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleAddCategory = () => setAddModalOpen(true);

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setEditCategoryName(category.categoryName);
    setEditCategoryDesc(category.description || '');
    setEditError('');
    setEditModalOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!editCategoryName.trim()) {
      setEditError('Category name is required');
      return;
    }
    
    if (editCategoryName.length > 15) {
      setEditError('Category name must be 15 characters or less');
      return;
    }

    setEditLoading(true);
    setEditError('');
    try {
      const userId = getOrCreateUserId();
      const updateData = {
        newCategoryName: editCategoryName
      };
      
      // Only include description if it's not empty
      if (editCategoryDesc.trim()) {
        updateData.newDescription = editCategoryDesc;
      }
      
      const res = await axiosInstance.patch(`/setting/users/${encodeURIComponent(userId)}/categories/${encodeURIComponent(editingCategory.categoryName)}`, updateData);
      const data = res.data;
      if (!data.success) throw new Error(data.error || 'Failed to update category');
      
      setEditModalOpen(false);
      setEditingCategory(null);
      setEditCategoryName('');
      setEditCategoryDesc('');
      await refetchCategories();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    setDeleteLoading(true);
    try {
      const userId = getOrCreateUserId();
      const res = await axiosInstance.delete(`/setting/users/${encodeURIComponent(userId)}/categories/${encodeURIComponent(editingCategory.categoryName)}`);
      const data = res.data;
      if (!data.success) throw new Error(data.error || 'Failed to delete category');
      
      setEditModalOpen(false);
      setShowDeleteConfirm(false);
      setEditingCategory(null);
      setEditCategoryName('');
      setEditCategoryDesc('');
      setSelectedCategory(null); // Clear selected category if it was deleted
      await refetchCategories();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };



  const handleAddCategorySubmit = async () => {
    setAddLoading(true);
    setAddError('');
    
    // Validation
    if (!newCategoryName.trim()) {
      setAddError('Category name is required');
      setAddLoading(false);
      return;
    }
    
    if (newCategoryName.length > 15) {
      setAddError('Category name must be 15 characters or less');
      setAddLoading(false);
      return;
    }
    
    try {
      const userId = getOrCreateUserId();
      const categoryData = {
        categoryName: newCategoryName
      };
      
      // Only include description if it's not empty
      if (newCategoryDesc.trim()) {
        categoryData.description = newCategoryDesc;
      }
      
      const res = await axiosInstance.post(`/setting/users/${encodeURIComponent(userId)}/categories`, categoryData);
      const data = res.data;
      if (!data.success) throw new Error(data.error || 'Failed to add category');
      setAddModalOpen(false);
      setNewCategoryName('');
      setNewCategoryDesc('');
      await refetchCategories();
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleClose}
        centered
        size="70%" // fixed width
        radius="md"
        shadow="xl"
        withCloseButton
        overlayProps={{
          backgroundOpacity: isDark ? 0.2 : 0.1,
          blur: 3,
        }}
        styles={{
          content: {
            height: '600px', // fixed height
            minHeight: '500px',
            maxHeight: '95vh',
            display: 'flex',
            flexDirection: 'column',
            border: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
            margin: 'auto',
            position: 'relative',
            overflow: 'hidden', // Prevent horizontal scroll
          },
          header: {
            borderBottom: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
            height: '60px',
            minHeight: '60px',
          },
          body: {
            height: 'calc(100% - 60px)',
            overflow: 'hidden', // Prevent horizontal scroll
            padding: 0,
          }
        }}
        title={
          <Group align="center" justify="space-between" style={{ width: '100%' }}>
            <Group align="center">
              <IconSettings size={24} stroke={1.5} />
              <Title order={4} fw={600}>
                Settings
              </Title>
            </Group>
            <Button
              variant="subtle"
              leftSection={<IconBook size={16} />}
              onClick={() => navigate('/docs')}
              size="sm"
              style={{
                color: isDark ? theme.colors.gray[3] : theme.colors.gray[7],
                fontWeight: 500
              }}
            >
              Docs
            </Button>
          </Group>
        }
        closeButtonProps={{ icon: <IconX size={20} /> }}
      >
        {(isLoading || urlLoading) && (
          <Group justify="center" align="center" style={{ height: '100%' }}>
            <Loader color="blue" size="lg" />
          </Group>
        )}
        {(error || urlError) && (
          <Alert color="red" title="Error" mt="md" icon={<IconX />}>
            {error?.message || urlError?.message || 'Failed to load settings.'}
          </Alert>
        )}
        {!isLoading && !error && !urlError && (
          <SidebarLayout
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            onAddCategory={handleAddCategory}
          >
            <UrlListPanel 
              selectedCategory={categoryWithUrls} 
              refetchCategories={handleRefetchAll}
              isLoading={urlLoading}
              onEditCategory={handleEditCategory}
            />
          </SidebarLayout>
        )}
      </Modal>

      {/* Add Category Modal - rendered outside Settings Modal */}
      <Modal 
        opened={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        title={<Text fw={700} size="lg">Add New Category</Text>}
        centered 
        size="sm"
        overlayProps={{
          backgroundOpacity: 0.3,
          blur: 2,
        }}
        styles={{
          root: {
            zIndex: 2001,
          },
          content: {
            zIndex: 2001,
          }
        }}
      >
        <Stack gap="md">
          <TextInput
            label="Category Name"
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            required
            maxLength={15}
            placeholder="Enter category name (max 15 characters)"
          />
          <Textarea
            label="Description (Optional)"
            value={newCategoryDesc}
            onChange={e => setNewCategoryDesc(e.target.value)}
            placeholder="Enter category description (optional)"
            minRows={3}
          />
          {addError && <Text color="red" size="sm">{addError}</Text>}
          <Button loading={addLoading} onClick={handleAddCategorySubmit} fullWidth>
            Add Category
          </Button>
        </Stack>
      </Modal>

      {/* Edit Category Modal */}
      <Modal 
        opened={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        title={<Text fw={700} size="lg">Edit Category</Text>}
        centered 
        size="sm"
        overlayProps={{
          backgroundOpacity: 0.3,
          blur: 2,
        }}
        styles={{
          root: {
            zIndex: 2001,
          },
          content: {
            zIndex: 2001,
          }
        }}
      >
        <Stack gap="md">
          <TextInput
            label="Category Name"
            value={editCategoryName}
            onChange={e => setEditCategoryName(e.target.value)}
            required
            maxLength={15}
            placeholder="Enter category name (max 15 characters)"
          />
          <Textarea
            label="Description (Optional)"
            value={editCategoryDesc}
            onChange={e => setEditCategoryDesc(e.target.value)}
            placeholder="Enter category description (optional)"
            minRows={3}
          />
          {editError && <Text color="red" size="sm">{editError}</Text>}
          <Group gap="sm">
            <Button 
              loading={deleteLoading} 
              color="red" 
              variant="light"
              onClick={() => setShowDeleteConfirm(true)}
              style={{ flex: 1 }}
            >
              Delete Category
            </Button>
            <Button 
              loading={editLoading} 
              onClick={handleUpdateCategory}
              style={{ flex: 1 }}
            >
              Update Category
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        opened={showDeleteConfirm} 
        onClose={() => setShowDeleteConfirm(false)} 
        title={<Text fw={700} size="md" c="red">Confirm Delete</Text>}
        centered 
        size="xs"
        overlayProps={{
          backgroundOpacity: 0.3,
          blur: 2,
        }}
        styles={{
          root: {
            zIndex: 2002,
          },
          content: {
            zIndex: 2002,
          }
        }}
      >
        <Stack gap="md" align="center">
          <Text c="red" ta="center">
            Are you sure you want to delete the category "{editingCategory?.categoryName}"? 
            This will also delete all URLs in this category and cannot be undone.
          </Text>
          <Group gap="sm">
            <Button 
              color="red" 
              onClick={handleDeleteCategory}
              loading={deleteLoading}
              leftSection={<IconTrash size={16} />}
            >
              Delete
            </Button>
            <Button 
              variant="subtle" 
              onClick={() => setShowDeleteConfirm(false)}
              leftSection={<IconX size={16} />}
            >
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

export default SettingsModal;