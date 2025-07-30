import { Flex, Stack } from "@mantine/core"
import { useMediaQuery } from '@mantine/hooks';
import CategoryBox from '../category/CategoryBox'
import QueryBox from './QueryBox'
import Submit from './Submit'
import { useCategoryList } from '../category/CategoryBox.controller'
import { getOrCreateUserId } from '../../utils/getOrCreateUserId'
import LoaderComponent from "../common/Loader"
import Error from "../common/Error"

function Bar({ onCategoryChange, searchResults, searchQuery, onQueryChange, selectedCategory, onSearch }) {
    const userId = getOrCreateUserId();
    const isMobile = useMediaQuery('(max-width: 768px)');
    
    const {
        data: categoryResponse = [],
        isLoading: loading,
        isError,
        refetch
    } = useCategoryList(userId);

    // The categoryService returns an array of strings directly
    // No need to extract categoryName since it's already the correct format
    const categoryList = Array.isArray(categoryResponse) ? categoryResponse : [];

    // Debug logging
    // Get the selected category value (string)
    const selectedValue = selectedCategory ? 
        (typeof selectedCategory === 'string' ? selectedCategory : selectedCategory.categoryName) : 
        (categoryList.length > 0 ? categoryList[0] : undefined);

    if (loading) {
        return (
            <Flex
                justify="center"
                align="center"
                direction="row"
                gap="md"
                p="lg"
                wrap="wrap"
            >
                <LoaderComponent message="Loading categories..." size="sm" variant="minimal" />
            </Flex>
        );
    }

    if (isError) {
        return (
            <Flex
                justify="center"
                align="center"
                direction="row"
                gap="md"
                p="lg"
                wrap="wrap"
            >
                <Error 
                    title="Failed to load categories"
                    message="Unable to fetch category list. Please try again."
                    showRetry={true}
                    onRetry={refetch}
                    variant="outline"
                />
            </Flex>
        );
    }

    // Use Stack for mobile, Flex for desktop
    const Container = isMobile ? Stack : Flex;
    const containerProps = isMobile 
        ? {
            align: "center",
            gap: "sm",
            p: "sm",
            w: "100%",
            style: { maxWidth: "90vw" }
        }
        : {
            justify: "center",
            align: "center",
            direction: "row",
            gap: "md",
            p: "lg",
            wrap: "wrap",
        };

    return (
        <Container 
            {...containerProps}
            role="search"
            aria-label="Search interface"
        >
            <CategoryBox 
                data={categoryList} 
                loading={loading}
                onCategoryChange={onCategoryChange}
                selectedValue={selectedValue}
                style={isMobile ? { width: '100%', maxWidth: '350px' } : {}}
                refetchCategories={refetch}
            />
            <QueryBox 
                value={searchQuery}
                onQueryChange={onQueryChange}
                onSearch={onSearch}
                style={isMobile ? { width: '100%', maxWidth: '350px' } : {}}
            />
            <Submit 
                onSearch={onSearch}
                searchQuery={searchQuery}
                selectedCategory={selectedValue}
                style={isMobile ? { width: '100%', maxWidth: '350px' } : {}}
                type="submit"
            />
        </Container>
    );
}

export default Bar;