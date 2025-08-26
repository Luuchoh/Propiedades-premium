
using Domain.Models;
using Infraestructure.Persistence.Services;
using MongoDB.Driver;
using Moq;

namespace UnitTests.Property;

[TestFixture]
public class PropertyRepositoryTests
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public async Task GetAsync_ShouldReturnAllProperties()
    {
    }
}